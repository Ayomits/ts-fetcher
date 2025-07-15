import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRestInstance } from '../src';
import { LocalCache } from '@ts-fetcher/cache';
import { EnhancedRequestOptions } from '@ts-fetcher/types';

const API_URL = 'https://api.example.com/';

const mockData = {
  message: 'Hello world',
};

describe('Test for cached requests', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => ({ message: 'Hello world' }),
      } as unknown as Response)
    );
  });

  test('Cached requests with infinity ttl', async () => {
    const globalCache = new LocalCache();

    const rest = createRestInstance(API_URL, {
      cache: globalCache,
    });

    const options: EnhancedRequestOptions = {
      method: 'GET',
      path: '/hello',
      cache: {
        cacheKey: 'mock',
        ttl: Infinity,
      },
    };

    const makeRequest = async () =>
      await rest.get('/hello', {
        ...options,
      });

    const resultNoCache = await makeRequest();
    const resultWithCache = await makeRequest();

    expect(resultNoCache).toEqual(rest.makeResponse(mockData, options, false, true));
    expect(resultWithCache).toEqual(rest.makeResponse(mockData, options, true, true));
  });

  test('Cached requests with finite ttl', async () => {
    const globalCache = new LocalCache();

    const rest = createRestInstance(API_URL, {
      cache: globalCache,
    });

    vi.useFakeTimers();

    const validttl = 1_000;

    const options: EnhancedRequestOptions = {
      method: 'GET',
      path: '/hello',
      cache: {
        cacheKey: 'mock',
        ttl: validttl,
      },
    };

    const invalidTtl = async (ttl: number) => {
      return await rest.get('/hello', {
        ...options,
        cache: {
          ttl,
          cacheKey: 'mock',
        },
      });
    };

    expect(invalidTtl(0)).toThrowError(Error);
    expect(invalidTtl(-1)).toThrowError(Error);

    const makeRequest = async () =>
      await rest.get('/hello', {
        ...options,
      });

    expect(await makeRequest()).toEqual(rest.makeResponse(mockData, options, false, true));
    expect(await makeRequest()).toEqual(rest.makeResponse(mockData, options, true, true));

    vi.advanceTimersByTime(validttl / 2);
    expect(await makeRequest()).toEqual(rest.makeResponse(mockData, options, true, true));

    vi.advanceTimersByTime(validttl + 1);
    expect(await makeRequest()).toEqual(rest.makeResponse(mockData, options, false, true));

    vi.useRealTimers();
  });

  test('Force cache options', async () => {
    const globalCache = new LocalCache();

    const rest = createRestInstance(API_URL, {
      cache: globalCache,
    });

    const options: EnhancedRequestOptions = {
      method: 'GET',
      cache: {
        cacheKey: 'mock-force',
        ttl: Infinity,
      },
      path: '/hello',
    };

    const query = async (reqoptions: EnhancedRequestOptions = options) =>
      await rest.get('/hello', reqoptions);

    // Default cache checks
    expect(await query()).toEqual(rest.makeResponse(mockData, options, false, true));
    expect(await query()).toEqual(rest.makeResponse(mockData, options, true, true));

    const forceOptions: EnhancedRequestOptions = {
      ...options,
      cache: {
        ...options.cache!,
        force: true,
      },
    };

    const overridenData = {
      ...mockData,
      overriden: true,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => overridenData,
      } as unknown as Response)
    );

    expect(await query(forceOptions)).toEqual(
      rest.makeResponse(overridenData, forceOptions, false, true)
    );

    expect(await query(options)).toEqual(
      rest.makeResponse(overridenData, forceOptions, true, true)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

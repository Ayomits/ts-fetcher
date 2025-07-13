import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRestInstance } from '../src';
import { LocalCache } from '../../cache/src';
import { EnhancedRequestOptions } from '@ts-fetcher/types';

const API_URL = 'https://api.example.com';

describe('Test rest request', () => {
  const mockData = {
    message: 'Success',
  };

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );
  });

  test('Base requests without caching', async () => {
    const rest = createRestInstance(API_URL);

    const result = await rest.get('/hello');

    expect(result).toEqual(
      rest.makeResponse(
        mockData,
        {
          path: '/hello',
          method: 'GET',
        },
        false,
        true
      )
    );

    expect(fetch).toBeCalledWith(`${API_URL}/hello`, {
      body: null,
      method: 'GET',
      path: '/hello',
    });
  });

  test('Default options', async () => {
    const rest = createRestInstance(API_URL, {
      defaultRequestOptions: {
        headers: {
          Authorization: 'Bearer token',
        },
      },
    });

    await rest.get('/hello');

    expect(fetch).toBeCalledWith(`${API_URL}/hello`, {
      method: 'GET',
      path: '/hello',
      body: null,
      headers: {
        Authorization: 'Bearer token',
      },
    });
  });

  test('Cached requests with infinity ttl', async () => {
    const rest = createRestInstance(API_URL, {
      cache: new LocalCache(),
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
    vi.useFakeTimers();

    const validttl = 1_000;

    const rest = createRestInstance(API_URL, {
      cache: new LocalCache(),
    });

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

  test('Refetch', async () => {
    const rest = createRestInstance(API_URL);
    vi.useFakeTimers();

    global.fetch = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500 }))
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        })
      );

    const options: EnhancedRequestOptions = {
      method: 'GET',
      path: '/endpoint',
    };

    const delay = 200;
    const attemps = 3;

    const requestPromise = rest.get('/endpoint', {
      refetch: {
        attemps: attemps,
        delay: delay,
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(delay + 10);

    expect(fetch).toHaveBeenCalledTimes(2);

    const result = await requestPromise;

    const expectedResponse = rest.makeResponse(
      mockData,
      { ...options, refetch: { attemps: attemps, delay: delay } },
      false,
      true
    );

    expect(result).toEqual(expectedResponse);

    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as Response));
    expect(await requestPromise).toThrowError(Error);
  });

  test('On request init lifecycle hook', async () => {
    const cache = new LocalCache();
    const rest = createRestInstance(API_URL, { cache });

    const makeOnRequestInit = vi.fn(async (requestOptions, restOptions) => {
      const oldMock = restOptions.cache?.get('mock') || {};
      const newMock = { ...oldMock, ...requestOptions.body };
      await restOptions.cache?.set('mock', newMock, Infinity);
      return {
        forceReturn: true,
        data: newMock,
      };
    });

    const options: EnhancedRequestOptions = {
      body: { hello: 'string' },
      cache: { cacheKey: 'mock', ttl: Infinity },
      lifecycle: { onRequestInit: makeOnRequestInit },
      method: 'POST',
      path: '/hallo',
    };

    const firstResponse = await rest.post('/hallo', options);
    expect(firstResponse).toEqual({
      cached: false,
      data: { hello: 'string' },
      options: expect.objectContaining({
        method: 'POST',
        path: '/hallo',
      }),
      success: true,
    });
    expect(makeOnRequestInit).toHaveBeenCalledTimes(1);

    const fromCache = await cache.get('mock');
    expect(fromCache).toEqual(firstResponse);

    const secondResponse = await rest.post('/hallo', options);
    expect(secondResponse).toEqual({
      cached: true,
      data: { hello: 'string' },
      options: expect.objectContaining({
        method: 'POST',
        path: '/hallo',
      }),
      success: true,
    });
    expect(makeOnRequestInit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

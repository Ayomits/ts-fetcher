import { ResponseInterceptor, RequestInterceptor } from '@ts-fetcher/types';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRestInstance } from '../src';

const API_URL = 'https://api.example.com';

describe('Interceptors', () => {
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Local interceptors', async () => {
    const rest = createRestInstance(API_URL);

    const ResInterceptor: ResponseInterceptor = (response) => {
      return {
        ...response,
        data: {
          ...mockData,
          overriden: true,
        },
      };
    };

    const ReqInterceptor: RequestInterceptor = (options) => {
      return {
        ...options,
        overriden: true,
      };
    };

    const withResInterceptor = await rest.get('/hello', {
      interceptors: {
        response: [ResInterceptor],
      },
    });

    expect(withResInterceptor).toEqual(
      rest.makeResponse(
        { ...mockData, overriden: true },
        {
          method: 'GET',
          path: '/hello',
          interceptors: {
            response: [ResInterceptor],
          },
        }
      )
    );

    const withReqInterceptor = await rest.get('/hello', {
      interceptors: {
        request: [ReqInterceptor],
      },
    });

    expect(withReqInterceptor).toEqual(
      rest.makeResponse(mockData, {
        method: 'GET',
        path: '/hello',
        interceptors: {
          request: [ReqInterceptor],
        },
        overriden: true,
      })
    );
  });
});

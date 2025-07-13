import { describe, expect, test } from 'vitest';
import {
  ApiResponse,
  EnhancedRequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
} from '@ts-fetcher/types';
import { chainRequestInterceptors, chainResponseInterceptors } from '../src';

const API_URL = 'https://api.example.com';

const requestOptions: EnhancedRequestOptions = {
  method: 'GET',
  path: '/apps',
  origin: API_URL,
};

describe('Chain request interceptors', () => {
  const interceptor: RequestInterceptor = (options) => {
    return {
      ...options,
      override: true,
    };
  };
  test('Overriden interceptors options', () => {
    expect(chainRequestInterceptors(requestOptions, [interceptor])).not.toEqual(requestOptions);
    expect(chainRequestInterceptors(requestOptions, [interceptor])).toEqual({
      ...requestOptions,
      override: true,
    });
  });

  test('Empty interceptors array', () => {
    expect(chainRequestInterceptors(requestOptions, [])).toEqual(requestOptions);
  });
});

describe('Chain response interceptors', () => {
  const data: ApiResponse = {
    cached: false,
    success: true,
    options: requestOptions,
    data: {
      msg: 'string',
    },
  };
  const interceptor: ResponseInterceptor = (data) => {
    return {
      ...data,
      override: true,
    };
  };
  test('Overriden interceptors options', () => {
    expect(chainResponseInterceptors(data, [interceptor])).not.toEqual(data);
    expect(chainResponseInterceptors(data, [interceptor])).toEqual({
      ...data,
      override: true,
    });
  });

  test('Empty interceptors array', () => {
    expect(chainResponseInterceptors(data, [])).toEqual(data);
  });
});

import {
  ApiResponse,
  EnhancedRequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
} from '@ts-fetcher/types';

export function chainRequestInterceptors<
  Req extends EnhancedRequestOptions = EnhancedRequestOptions,
>(defaultOptions: Req, interceptors: RequestInterceptor[], __idx = 0) {
  const current = interceptors[__idx];
  if (!current) {
    return defaultOptions;
  }

  const options = current(defaultOptions as never);
  return chainRequestInterceptors(options, interceptors, __idx + 1);
}

export function chainResponseInterceptors<Res extends ApiResponse = ApiResponse>(
  data: Res,
  interceptors: ResponseInterceptor[],
  __idx = 0
) {
  const current = interceptors[__idx];
  if (!current) {
    return data;
  }

  const options = current(data as never);
  return chainResponseInterceptors(options, interceptors, __idx + 1);
}

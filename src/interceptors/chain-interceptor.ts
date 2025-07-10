import { RequestOptions, RestResponse } from '@/rest';
import { RequestInterceptor, ResponseInterceptor } from './types';

export function chainRequestInterceptors<Req extends RequestOptions = RequestOptions>(
  defaultOptions: Req,
  interceptors: RequestInterceptor[],
  __idx = 0
) {
  const current = interceptors[__idx];
  if (!current) {
    return defaultOptions;
  }

  const options = current(defaultOptions as any);
  return chainRequestInterceptors(options, interceptors, __idx + 1);
}

export function chainResponseInterceptors<Res extends RestResponse = RestResponse>(
  data: Res,
  interceptors: ResponseInterceptor[],
  __idx = 0
) {
  const current = interceptors[__idx];
  if (!current) {
    return data;
  }

  const options = current(data as any);
  return chainResponseInterceptors(options, interceptors, __idx + 1);
}

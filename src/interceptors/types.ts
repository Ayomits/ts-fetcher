import { LiteralEnum } from '@/lib';
import { RequestOptions, RestResponse } from '@/rest';

export type RequestInterceptor = <Req = unknown>(
  options: RequestOptions<Req>
) => RequestOptions<Req>;

export type ResponseInterceptor = <Res = unknown>(options: RestResponse<Res>) => RestResponse<Res>;

export const InterceptorType = {
  Res: 'response',
  Req: 'request',
} as const;

export type InterceptorType = LiteralEnum<typeof InterceptorType>;

export type Interceptor<T extends InterceptorType = InterceptorType> =
  T extends typeof InterceptorType.Req ? RequestInterceptor : ResponseInterceptor;

export type ChainInterceptorOptionsType<
  T extends InterceptorType = InterceptorType,
  K = unknown,
> = T extends typeof InterceptorType.Req ? RequestOptions<K> : RestResponse<K>;

import { RequestInterceptor, ResponseInterceptor } from '../interceptors';
import { type Cache } from '@ts-fetcher/cache';
import { type LiteralEnum } from '@ts-fetcher/types';

export interface RestInterceptorsOptions {
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
  executeOnCached?: boolean;
}

export interface RestOptions {
  cache: Cache;
  interceptors?: RestInterceptorsOptions;
}

export const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE',
  Options: 'OPTIONS',
  Head: 'HEAD',
} as const;

export type HttpMethod = LiteralEnum<typeof HttpMethod>;

export const ParseBodyType = {
  Json: 'JSON',
  FormData: 'FormDaa',
} as const;

export type ParseBodyType = LiteralEnum<typeof ParseBodyType>;

export interface RequestBody<T = unknown> {
  data: T;
  parseAs: ParseBodyType;
}

export type RequestBodyType<
  M extends HttpMethod = HttpMethod,
  RB = unknown,
> = M extends typeof HttpMethod.Get ? null : RequestBody<RB>;

export interface RequestCacheOptions {
  cacheKey: string;
  ttl?: number;
}

export interface FetchOptions<RB = unknown, M extends HttpMethod = HttpMethod> {
  path: string;
  origin?: string | undefined;
  method: M;
  headers?: Headers;
  body?: RequestBodyType<M, RB> | undefined;
  cache?: RequestCacheOptions | undefined;
  cookie?: string | undefined;
  credentials?: RequestCredentials;
  destination?: RequestDestination;
  integrity?: string;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  url?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
  clone?: () => Request;
}

export interface RequestOptions<RB = unknown, M extends HttpMethod = HttpMethod>
  extends FetchOptions<RB, M> {
  interceptors?: RestInterceptorsOptions;
}

export interface RestResponse<D = unknown> {
  success: boolean;
  data: D;
  cached: boolean;
}

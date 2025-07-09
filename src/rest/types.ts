import { CacheService, LocalCacheService } from '@/cache/types';
import { LiteralEnum } from '@/lib/literal-enum';

export type RestCache = CacheService | LocalCacheService;

export interface RestOptions {
  cache: RestCache;
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

export interface RequestBody<T = any> {
  data: T;
  parseAs: ParseBodyType;
}

export type RequestBodyType<
  M extends HttpMethod = HttpMethod,
  RB = any,
> = M extends typeof HttpMethod.Get ? null : RequestBody<RB>;

export interface RequestCacheOptions {
  cacheKey: string;
  ttl?: number;
}

export interface RequestOptions<RB = any, M extends HttpMethod = HttpMethod> {
  path: string;
  origin?: string;
  method: M;
  headers?: Record<string, string>;
  body?: RequestBodyType<M, RB>;
  cache?: RequestCacheOptions;
}

export interface RestResponse<D = any> {
  success: boolean;
  data: D;
  cached: boolean;
}

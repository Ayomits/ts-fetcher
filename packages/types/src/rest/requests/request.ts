import { LiteralEnum } from '@/utility';
import { RequestInterceptor, ResponseInterceptor } from '@/rest/interceptors';
import { CacheServiceImplementation } from '@/cache';

// ==================== Interceptors ====================
export interface InterceptorConfiguration {
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
  executeOnCached?: boolean;
}

// ==================== HTTP Constants ====================
export const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE',
  Options: 'OPTIONS',
  Head: 'HEAD',
} as const;

export const BodyParserType = {
  Json: 'JSON',
  FormData: 'FormData',
} as const;

// ==================== Type Definitions ====================
export type HttpMethodType = LiteralEnum<typeof HttpMethod>;
export type BodyParserType = LiteralEnum<typeof BodyParserType>;

// ==================== Request/Response Types ====================
export interface RequestBody<T = unknown> {
  data: T;
  parseAs: BodyParserType;
}

export type MethodSpecificRequestBody<
  Method extends HttpMethodType = HttpMethodType,
  BodyData = unknown,
> = Method extends typeof HttpMethod.Get ? null : RequestBody<BodyData>;

export interface CacheConfiguration {
  cacheKey: string;
  ttl?: number;
}

export interface BaseRequestOptions<
  BodyData = unknown,
  Method extends HttpMethodType = HttpMethodType,
> {
  // Core request properties
  path: string;
  method: Method;

  // Network configuration
  origin?: string;
  headers?: Headers;
  body?: MethodSpecificRequestBody<Method, BodyData>;
  credentials?: RequestCredentials;

  // Cache configuration
  cache?: CacheConfiguration;

  // Browser fetch options
  cookie?: string;
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

export interface EnhancedRequestOptions<
  BodyData = unknown,
  Method extends HttpMethodType = HttpMethodType,
> extends BaseRequestOptions<BodyData, Method> {
  interceptors?: InterceptorConfiguration;
}

// ==================== Response Types ====================
export interface ApiResponse<ResponseData = unknown> {
  success: boolean;
  data: ResponseData;
  cached: boolean;
}

// ==================== Instance Configuration ====================
export interface RestClientConfiguration {
  cache: CacheServiceImplementation;
  interceptors?: InterceptorConfiguration;
}

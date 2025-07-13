import { LiteralEnum } from '@/utility';
import { RequestInterceptor, ResponseInterceptor } from '@/rest/interceptors';
import { BaseCacheService } from '@/cache';

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

// ==================== Request/Response Types ====================

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
  headers?: Record<string, string>;
  body?: BodyData;
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
  keepalive?: boolean;
  signal?: AbortSignal;
  clone?: () => Request;
}

interface RefetchRequestOptions {
  delay: number;
  attemps: number;
}

export interface OnRequestInitReturn {
  forceReturn?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface RequestLifecycleOptions {
  onRequestInit: <REQ extends EnhancedRequestOptions = EnhancedRequestOptions>(
    requestOptions: REQ,
    restOptions?: Partial<RestClientConfiguration>
  ) => Promise<OnRequestInitReturn>;
}

export interface EnhancedRequestOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BodyData = any,
  Method extends HttpMethodType = HttpMethodType,
> extends BaseRequestOptions<BodyData, Method> {
  interceptors?: InterceptorConfiguration;
  refetch?: RefetchRequestOptions;
  lifecycle?: Partial<RequestLifecycleOptions>;
}

// ==================== Response Types ====================
export interface ApiResponse<
  ResponseData = unknown,
  BodyData = unknown,
  Method extends HttpMethodType = HttpMethodType,
> {
  success: boolean;
  data: ResponseData;
  cached: boolean;
  options: EnhancedRequestOptions<BodyData, Method>;
}

// ==================== Instance Configuration ====================
export interface RestClientConfiguration {
  cache: BaseCacheService;
  interceptors?: InterceptorConfiguration;
  defaultRequestOptions?: Partial<EnhancedRequestOptions>;
}

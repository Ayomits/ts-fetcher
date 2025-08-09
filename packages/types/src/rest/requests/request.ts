import type { LiteralEnum } from '@/utility';
import type { RequestInterceptor, ResponseInterceptor } from '@/rest/interceptors';

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

export interface RefetchRequestOptions {
  delay: number;
  attemps: number;
}

export interface EnhancedRequestOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BodyData = any,
  Method extends HttpMethodType = HttpMethodType,
> extends BaseRequestOptions<BodyData, Method> {
  interceptors?: InterceptorConfiguration;
  refetch?: RefetchRequestOptions;
}

// ==================== Response Types ====================
export interface ApiResponse<
  ResponseData = unknown,
  BodyData = unknown,
  Method extends HttpMethodType = HttpMethodType,
> {
  success: boolean;
  data: ResponseData;
  raw: Response;
  options: EnhancedRequestOptions<BodyData, Method>;
}

// ==================== Instance Configuration ====================
export interface RestClientConfiguration {
  interceptors?: InterceptorConfiguration;
  defaultRequestOptions?: Partial<EnhancedRequestOptions>;
}

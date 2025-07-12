import { ApiResponse, EnhancedRequestOptions } from '@/rest';

// ==================== Core Interceptor Types ====================
export type RequestInterceptor<RequestBody = unknown> = (
  options: EnhancedRequestOptions<RequestBody>
) => EnhancedRequestOptions<RequestBody>;

export type ResponseInterceptor<ResponseData = unknown> = (
  response: ApiResponse<ResponseData>
) => ApiResponse<ResponseData>;

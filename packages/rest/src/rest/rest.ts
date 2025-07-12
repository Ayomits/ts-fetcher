import {
  ApiResponse,
  BodyParserType,
  EnhancedRequestOptions,
  RestClientConfiguration,
} from '@ts-fetcher/types';
import { chainRequestInterceptors, chainResponseInterceptors } from '../';

export class Rest {
  public origin: string;
  public restOptions: Partial<RestClientConfiguration>;

  constructor(origin: string, options?: Partial<RestClientConfiguration>) {
    this.origin = origin;
    this.restOptions = options ?? {};
  }

  public async get<RES = unknown>(
    path: string,
    options?: Omit<Partial<EnhancedRequestOptions>, 'body'>
  ) {
    return await this.request<RES>({
      path,
      method: 'GET',
      ...options,
    });
  }

  public async post<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<EnhancedRequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'POST',
      ...options,
    });
  }

  public async put<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<EnhancedRequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'PUT',
      ...options,
    });
  }

  public async patch<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<EnhancedRequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async delete<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<EnhancedRequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async request<RES = unknown, REQ = unknown>(
    options: EnhancedRequestOptions<REQ>
  ): Promise<ApiResponse<RES>> {
    const interceptors = this.mergeInterceptors(options);
    if (interceptors.request?.length) {
      options = chainRequestInterceptors(options, interceptors.request);
    }

    if (!this.restOptions.cache && options.cache) {
      throw new Error('Rest cache options is not provided!');
    }

    if (this.restOptions.cache && options.cache) {
      const valueFromCache = await this.restOptions.cache?.get<ApiResponse<RES>>?.(
        options.cache.cacheKey
      );
      if (valueFromCache) {
        return this.restOptions.interceptors?.executeOnCached ||
          options.interceptors?.executeOnCached
          ? this.responseWithInterceptors(valueFromCache, interceptors)
          : valueFromCache;
      }
    }

    const body =
      options.body && options.method !== 'GET'
        ? this.parseBody(options.body.parseAs, options.body.data)
        : null;

    const response = await fetch(`${options.origin ?? this.origin}/${options.path}`, {
      // @ts-expect-error I hate ts
      body,
      ...options,
    });

    const formated = {
      success: response.ok,
      data: await this.parseJsonResponse<RES>(response),
      // TODO: cache logic
      cached: true,
    };

    if (options.cache && this.restOptions.cache) {
      await this.restOptions.cache.set(
        options.cache.cacheKey,
        formated,
        options.cache.ttl ?? Infinity
      );
    }

    return this.responseWithInterceptors(
      {
        ...formated,
        cached: false,
      },
      interceptors
    );
  }

  public responseWithInterceptors<RES = unknown>(
    data: ApiResponse<RES>,
    interceptors: ReturnType<typeof this.mergeInterceptors>
  ) {
    return interceptors.response.length
      ? chainResponseInterceptors(data, interceptors.response)
      : data;
  }

  public mergeInterceptors<REQ = unknown>(options: EnhancedRequestOptions<REQ>) {
    const resInterceptors = this.restOptions.interceptors?.response ?? [];
    const reqInterceptors = this.restOptions.interceptors?.request ?? [];

    return {
      request: [...reqInterceptors, ...(options.interceptors?.request ?? [])],
      response: [...resInterceptors, ...(options.interceptors?.response ?? [])],
    };
  }

  public async invalidate(cacheKey: string) {
    if (!this.restOptions.cache) {
      throw new Error('Cache is not provided!');
    }
    await this.restOptions.cache.delete(cacheKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parseBody(parseAs: BodyParserType, data: any) {
    switch (parseAs) {
      case 'JSON':
        return JSON.stringify(data);
      default:
        return new FormData(data);
    }
  }

  public async parseJsonResponse<RES = unknown>(res: Response) {
    try {
      return (await res.json()) as RES;
    } catch {
      return null as RES;
    }
  }
}

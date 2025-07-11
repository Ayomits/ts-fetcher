import { chainRequestInterceptors, chainResponseInterceptors } from '../';
import type { ParseBodyType, RequestOptions, RestOptions, RestResponse } from './types';

export class Rest {
  public origin: string;
  public restOptions: Partial<RestOptions>;

  constructor(origin: string, options?: Partial<RestOptions>) {
    this.origin = origin;
    this.restOptions = options ?? {};
  }

  public async get<RES = unknown>(path: string, options?: Omit<Partial<RequestOptions>, 'body'>) {
    return await this.request<RES>({
      path,
      method: 'GET',
      ...options,
    });
  }

  public async post<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<RequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'POST',
      ...options,
    });
  }

  public async put<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<RequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'PUT',
      ...options,
    });
  }

  public async patch<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<RequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async delete<RES = unknown, REQ = unknown>(
    path: string,
    options?: Partial<RequestOptions<REQ>>
  ) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async request<RES = unknown, REQ = unknown>(
    options: RequestOptions<REQ>
  ): Promise<RestResponse<RES>> {
    const interceptors = this.mergeInterceptors(options);
    if (interceptors.request?.length) {
      options = chainRequestInterceptors(options, interceptors.request);
    }

    if (!this.restOptions.cache && options.cache) {
      throw new Error('Rest cache options is not provided!');
    }

    if (this.restOptions.cache && options.cache) {
      const valueFromCache = await this.restOptions.cache?.get<RestResponse<RES>>?.(
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
    data: RestResponse<RES>,
    interceptors: ReturnType<typeof this.mergeInterceptors>
  ) {
    return interceptors.response.length
      ? chainResponseInterceptors(data, interceptors.response)
      : data;
  }

  public mergeInterceptors<REQ = unknown>(options: RequestOptions<REQ>) {
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
    await this.restOptions.cache.del(cacheKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parseBody(parseAs: ParseBodyType, data: any) {
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

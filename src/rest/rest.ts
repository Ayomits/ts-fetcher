import { DEFAULT_REST_OPTIONS } from './options';
import type { ParseBodyType, RequestOptions, RestOptions, RestResponse } from './types';

export class Rest {
  public origin: string;
  public restOptions: Partial<RestOptions>;

  constructor(origin: string, options: Partial<RestOptions> = DEFAULT_REST_OPTIONS) {
    this.origin = origin;
    this.restOptions = options;
  }

  public async get<RES = any>(path: string, options?: Omit<Partial<RequestOptions>, 'body'>) {
    return await this.request<RES>({
      path,
      method: 'GET',
      ...options,
    });
  }

  public async post<RES = any, REQ = any>(path: string, options?: Partial<RequestOptions<REQ>>) {
    return await this.request<RES>({
      path,
      method: 'POST',
      ...options,
    });
  }

  public async put<RES = any, REQ = any>(path: string, options?: Partial<RequestOptions<REQ>>) {
    return await this.request<RES>({
      path,
      method: 'PUT',
      ...options,
    });
  }

  public async patch<RES = any, REQ = any>(path: string, options?: Partial<RequestOptions<REQ>>) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async delete<RES = any, REQ = any>(path: string, options?: Partial<RequestOptions<REQ>>) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async request<RES = any, REQ = any>(
    options: RequestOptions<REQ>
  ): Promise<RestResponse<RES>> {
    if (this.restOptions.cache && options.cache) {
      // @ts-expect-error cache always returns generic values
      const valueFromCache = await this.restOptions.cache.get<RestResponse<RES>>(
        options.cache.cacheKey
      );
      if (valueFromCache) {
        return valueFromCache;
      }
    }
    const body =
      options.body && options.method !== 'GET'
        ? this.parseBody(options.body.parseAs, options.body.data)
        : null;

    const response = await fetch(`${options.origin ?? this.origin}/${options.path}`, {
      headers: options.headers ?? {},
      method: options.method,
      body: body,
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

    return {
      ...formated,
      cached: false,
    };
  }

  public parseBody(parseAs: ParseBodyType, data: any) {
    switch (parseAs) {
      case 'JSON':
        return JSON.stringify(data);
      default:
        return new FormData(data);
    }
  }

  public async parseJsonResponse<RES = any>(res: Response) {
    try {
      return (await res.json()) as RES;
    } catch {
      return null as RES;
    }
  }
}

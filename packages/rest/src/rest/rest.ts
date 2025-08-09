import { ApiResponse, EnhancedRequestOptions, RestClientConfiguration } from '@ts-fetcher/types';
import { chainRequestInterceptors, chainResponseInterceptors, sleepWithCallback } from '../';
import { defaultRequestOptions } from './options';

type RequestOptions<REQ> = Omit<Partial<EnhancedRequestOptions<REQ>>, 'origin' | 'method' | 'path'>;

export class Rest {
  public origin: string;
  public restOptions: Partial<RestClientConfiguration>;

  constructor(origin: string, options?: Partial<RestClientConfiguration>) {
    this.origin = origin;
    this.restOptions = {
      defaultRequestOptions: {
        ...defaultRequestOptions,
        ...options?.defaultRequestOptions,
      },
      ...options,
    };
  }

  public async get<RES = unknown>(path: string, options?: Omit<RequestOptions<RES>, 'body'>) {
    return await this.request<RES>({
      path,
      method: 'GET',
      ...options,
    });
  }

  public async post<RES = unknown, REQ = unknown>(path: string, options?: RequestOptions<REQ>) {
    return await this.request<RES>({
      path,
      method: 'POST',
      ...options,
    });
  }

  public async put<RES = unknown, REQ = unknown>(path: string, options?: RequestOptions<REQ>) {
    return await this.request<RES>({
      path,
      method: 'PUT',
      ...options,
    });
  }

  public async patch<RES = unknown, REQ = unknown>(path: string, options?: RequestOptions<REQ>) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async delete<RES = unknown, REQ = unknown>(path: string, options?: RequestOptions<REQ>) {
    return await this.request<RES>({
      path,
      method: 'DELETE',
      ...options,
    });
  }

  public async request<RES = unknown, REQ = unknown>(
    options: EnhancedRequestOptions<REQ>
  ): Promise<ApiResponse<RES>> {
    //===============LIFECYCLE================
    if (this.restOptions.defaultRequestOptions) {
      options = { ...this.restOptions.defaultRequestOptions, ...options };
    }
    const interceptors = this.mergeInterceptors(options);
    if (interceptors.request?.length) {
      options = chainRequestInterceptors(options, interceptors.request);
    }

    //=================REFETCH===================
    let response = await this.makeRequest(options);

    if (!response.ok && options.refetch) {
      if (
        options.refetch.delay <= 0 ||
        !Number.isFinite(options.refetch.delay) ||
        !Number.isInteger(options.refetch.delay)
      ) {
        throw new Error('Refetch delay must be a valid number');
      }
      for (let i = 0; i < options.refetch.attemps; i++) {
        const isSuccess = await sleepWithCallback(options.refetch.delay, async () => {
          const res = await this.makeRequest(options);
          response = res;
          return res.ok;
        });
        if (isSuccess) {
          break;
        }

        if (!isSuccess && options.refetch.attemps === i + 1) {
          throw new Error(`Refetch attemps failed...\n ${response}`);
        }
      }
    }

    return {
      data: await this.parseJsonResponse(response),
      success: response.ok,
      raw: response,
      options,
    };
  }

  public async makeRequest<REQ extends EnhancedRequestOptions = EnhancedRequestOptions>(
    options: REQ
  ) {
    const body =
      options.body && options.method !== 'GET' ? await this.parseBody(options.body) : null;

    return await fetch(
      `${options.origin ?? this.origin}${options.path.startsWith('/') ? options.path : '/' + options.path}`,
      {
        ...options,
        body,
      }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async parseBody(body: any) {
    if (body === null) {
      return null;
    } else if (typeof body === 'string') {
      return body;
    } else if (typeof body === 'object') {
      return JSON.stringify(body);
    }
    return body;
  }

  public async parseJsonResponse(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
}

import type { EnhancedRequestOptions, RestClientConfiguration } from '@ts-fetcher/types';

export const defaultRequestOptions: Partial<EnhancedRequestOptions> = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const defaultRestOptions: Partial<RestClientConfiguration> = {
  defaultRequestOptions,
};

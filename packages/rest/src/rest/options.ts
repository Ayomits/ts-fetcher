import type { EnhancedRequestOptions, RestClientConfiguration } from '@ts-fetcher/types';

export const defaultRequestOptions: Partial<EnhancedRequestOptions> = {
  headers: {
    'Content-Type': 'application/json',
  },
  refetch: {
    attemps: 3,
    delay: 2_000,
  },
};

export const defaultRestOptions: Partial<RestClientConfiguration> = {
  defaultRequestOptions,
};

import type { RestClientConfiguration } from '@ts-fetcher/types';
import { Rest } from './rest';

export interface CreateRestInstanceOptions<I extends Rest = Rest>
  extends Partial<RestClientConfiguration> {
  customInstance?: new (
    origin: string,
    options?: Partial<RestClientConfiguration> | undefined
  ) => I;
}

export function createRestInstance<I extends Rest = Rest>(
  origin: string,
  options?: CreateRestInstanceOptions<I>
) {
  return options?.customInstance
    ? new options.customInstance(origin, options)
    : new Rest(origin, options as RestClientConfiguration);
}

export function createRest(options?: CreateRestInstanceOptions) {
  const Extender = options?.customInstance ?? Rest;

  class CustomRest extends Extender {
    constructor(origin: string, modifiedOptions?: Partial<RestClientConfiguration>) {
      super(origin, { ...options, ...modifiedOptions });
    }
  }

  function createCustomRestInstance(
    origin: string,
    modifiedOptions?: Partial<RestClientConfiguration>
  ) {
    return createRestInstance<CustomRest>(origin, {
      ...options,
      ...modifiedOptions,
      customInstance: CustomRest,
    });
  }

  return { CustomRest, createCustomRestInstance };
}

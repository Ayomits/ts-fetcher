import { RestClientConfiguration } from '@ts-fetcher/types';
import { Rest } from './rest';

interface CreateRestInstanceOptions<I extends Rest = Rest> extends RestClientConfiguration {
  customInstance?: new (origin: string, options?: RestClientConfiguration) => I;
}

export function createRestInstance<I extends Rest = Rest>(
  origin: string,
  options?: CreateRestInstanceOptions<I>
) {
  return options?.customInstance
    ? new options.customInstance(origin, options)
    : new Rest(origin, options as RestClientConfiguration);
}

export function createRest(options: CreateRestInstanceOptions) {
  const Extender = options.customInstance ?? Rest;

  class CustomRest extends Extender {}

  function createCustomRestInstance(origin: string) {
    return createRestInstance<CustomRest>(origin, {
      ...options,
      customInstance: CustomRest,
    });
  }

  return { CustomRest, createCustomRestInstance };
}

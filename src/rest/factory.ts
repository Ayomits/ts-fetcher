import { Rest } from './rest';
import { RestOptions } from './types';

interface CreateRestInstanceOptions<I extends Rest = Rest> extends RestOptions {
  customInstance?: new (origin: string, options?: RestOptions) => I;
}

export function createRestInstance<I extends Rest = Rest>(
  origin: string,
  options?: CreateRestInstanceOptions<I>
) {
  return options?.customInstance
    ? new options.customInstance(origin, options)
    : new Rest(origin, options);
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

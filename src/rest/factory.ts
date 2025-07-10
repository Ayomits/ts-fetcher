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
    ? new options.customInstance(origin, { cache: options.cache })
    : new Rest(origin, options);
}

interface CreateRestOptions extends CreateRestInstanceOptions {
  returnTuple?: boolean;
}

export function createRest(options: CreateRestOptions) {
  const Extender = options.customInstance ?? Rest;

  class CustomRest extends Extender {}

  function createCustomRestInstance(origin: string) {
    return createRestInstance<CustomRest>(origin, {
      cache: options.cache,
      customInstance: CustomRest,
    });
  }


  return { CustomRest, createCustomRestInstance };
}

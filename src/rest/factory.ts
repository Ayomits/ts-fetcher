import { createCache } from '@/cache';
import { Rest } from './rest';
import { RestOptions } from './types';

interface CreateRestInstanceOptions<I extends Rest = Rest> extends RestOptions {
  customInstance?: new (origin: string, options: RestOptions) => I;
}

export function createRestInstance<I extends Rest = Rest>(
  origin: string,
  options: CreateRestInstanceOptions<I>
) {
  return options.customInstance
    ? new options.customInstance(origin, { cache: options.cache })
    : new Rest(origin, options);
}

interface CreateRestOptions extends CreateRestInstanceOptions {
  returnTuple?: boolean;
}

export function createRest(origin: string, options: CreateRestOptions) {
  const Extender = options.customInstance ?? Rest;

  class CustomRest extends Extender {
    constructor(origin: string, options: RestOptions) {
      super(origin, options);
    }
  }

  function createCustomInstance(origin: string) {
    return createRestInstance<CustomRest>(origin, {
      cache: options.cache,
      customInstance: CustomRest,
    });
  }

  const instance = createCustomInstance(origin);

  return { instance, CustomRest, createCustomInstance };
}

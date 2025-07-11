import { Timestamp } from '../types';

export interface LocalCacheValues<T = unknown> {
  data: T;
  createdAt: Timestamp;
  expiresAt: Timestamp | null;
  timeout: NodeJS.Timeout | null;
}

export type GetCacheValueReturn<F extends boolean, T = unknown> = F extends true
  ? LocalCacheValues<T>
  : T;

export interface GetCacheValueOptions<R extends boolean = boolean> {
  raw: R;
}

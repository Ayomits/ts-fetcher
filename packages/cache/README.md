# ts-fetcher

TypeScript module for caching with 2 strategies

## Features

- [x] Multiple caching strategies:
  - In-memory caching
  - Redis caching
  - Custom cache implementations

## Installation

```bash
npm install @ts-fetcher/cache
# or
yarn add @ts-fetcher/cache
# or
bun add @ts-fetcher/cache
# or
pnpm add @ts-fetcher/cache
```

## Strategies

There are two ways how to use cache

1. Local cache (in-memory)

```ts
import { LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();
```

2. Redis cache (ioredis backend)

Install ioredis

```bash
npm install ioredis @ts-fetcher/redis
# or
yarn add ioredis @ts-fetcher/redis
# or
bun add ioredis @ts-fetcher/redis
# or
pnpm add ioredis @ts-fetcher/redis
```

```ts
import { RedisCache, LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();

const redis = new RedisCache({
  host: 'localhost',
  password: 'redis',
  port: 6379,
});

await redis.set('key', 'value', 500);
```

## Cache usage

For this examples not important what kind of strategy have you choosen

1. Get

```ts
import { LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();

// no type assertion
local.get('key-primitive');

// with type assertion
local.get<object>('key-assertion');
```

2. Set

```ts
import { LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();

// no type assertion
local.set('key-primitive', 10);

// this value will be removed after 500 miliseconds
local.set<object>('key-assertion', { hello: 'world' }, 500);

// this value will be cached forever
local.set<object>('key-assertion', { hello: 'world' }, Infinity);

// Lifecycle
// After expiration will

const onExpire = (key, value, raw) => {
  console.log(key);
};

local.set<object>('key-assertion', { hello: 'world' }, 1_000, onExpire);
```

3. Del

```ts
import { LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();

// it will delete value by key
local.del('key-primitive');
```

## Custom cache

```ts
import { CacheService, type CachedValue } from 'ts-fetcher';

class CustomCache implements CacheService {
  get<T>(key: string): T | null {
    // Your implementation
  }

  set<T>(
    key: string,
    value: T,
    ttl: number,
    onExpire?: (key: string, value: T, raw: Omit<CachedValue<T>, 'evictionTimeout'>) => void
  ): void {
    // Your implementation
  }

  del(key: string): boolean {
    // Your implementation
  }
}
```

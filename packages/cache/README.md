# ts-fetcher

TypeScript module for caching with 2 strategies <br>

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
import { createCache, LocalCache } from '@ts-fetcher/cache';

const factoryWay = createCache('local');

const instanceWay = new LocalCache();
```

2. Redis cache (ioredis backend)

Install ioredis

```bash
npm install ioredis
# or
yarn add ioredis
# or
bun add ioredis
# or
pnpm add ioredis
```

```ts
import { createCache, RedisCache } from '@ts-fetcher/cache';

const factoryWay = createCache('local', {
  host: 'localhost',
  password: 'redis',
  port: 6379,
});

const instanceWay = new RedisCache({
  host: 'localhost',
  password: 'redis',
  port: 6379,
});
```

## Cache usage

For this examples not important what kind of strategy have you choosen

1. Get

```ts
import { createCache } from '@ts-fetcher/cache';

const factoryWay = createCache('local');

// no type assertion
await factoryWay.get("key-primitive")

// with type assertion
await factoryWay.get<object>("key-assertion")

```

2. Set
```ts
import { createCache } from '@ts-fetcher/cache';

const factoryWay = createCache('local');

// no type assertion
await factoryWay.set("key-primitive", 10)

// this value will be removed after 500 miliseconds
await factoryWay.set<object>("key-assertion", { hello: "world" }, 500)

// this value will be cached forever
await factoryWay.set<object>("key-assertion", { hello: "world" })
```

3. Del

```ts
import { createCache } from '@ts-fetcher/cache';

const factoryWay = createCache('local');

// it will delete value by key
await factoryWay.del("key-primitive")
```


## Custom cache

```ts
import { CacheService } from 'ts-fetcher';

class CustomCache implements CacheService {
  async get<T>(key: string): Promise<T | null> {
    // Your implementation
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    // Your implementation
  }

  async del(key: string): Promise<boolean> {
    // Your implementation
  }
}
```

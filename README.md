# ts-fetcher

TypeScript module for convenient fetch API handling <br>
RU version -> [link](https://github.com/Ayomits/ts-fetch/blob/master/README.ru.md)

## Features

- [x] Multiple caching strategies:
  - In-memory caching
  - Redis caching
  - Custom cache implementations
- [x] Full type safety
- [x] Minimal boilerplate
- [x] Class-based approach

## Installation

```bash
npm install ts-fetcher
# or
yarn add ts-fetcher
# or
bun add ts-fetcher
# or
pnpm add ts-fetcher
```

## Quick start

1. Using pre-built classes <br>

```ts
import { Rest, LocalCacheRest, RedisCacheRest, createCache } from 'ts-fetcher';

// Standard Rest with local cache
const defaultRest = new Rest('https://api.example.com', {
  cache: createCache('local'),
});

// Dedicated local cache class
const localRest = new LocalCacheRest('https://api.example.com');

// Redis cache (requires ioredis)
const redisRest = new RedisCacheRest('https://api.example.com', {
  host: 'localhost',
  port: 6379,
  password: 'redis',
});
```

2. Using factories

```ts
import { createRest, createCache } from 'ts-fetcher';

// Factory for local cache
const { CustomRest: LocalRest, createCustomRestInstance: createLocalRest } = createRest({
  cache: createCache('local'),
});

const localRest = createLocalRest('https://api.example.com');
```

## Making requests

1. Basic requests <br>

```ts
// Without caching
await rest.get('/data');

// With caching
await rest.get('/data', {
  cache: {
    cacheKey: 'data-key',
    ttl: 5000, // 5 seconds
  },
});

// Cache invalidation
await rest.invalidate('data-key');
```

2. Typed requests <br>

```ts
interface User {
  id: number;
  name: string;
}

interface UpdateUserDto {
  name: string;
}

// Typed GET
const { data } = await rest.get<User>('/users/1');

// Typed POST/PUT/PATCH
await rest.post<User, UpdateUserDto>('/users', {
  name: 'John',
});
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

const customRest = new Rest('https://api.example.com', {
  cache: new CustomCache(),
});
```

## Interceptors

You may familar with interceptors concepts in axios. They allows to mutate response/request during request lifecycle <br>

Usage:

```ts
import { createCache, createRest, RequestInterceptor, ResponseInterceptor } from 'ts-fetcher';

const ReqInterceptor: RequestInterceptor = (options) => {
  return {
    ...options,
    cache: {
      cacheKey: `example_${Date.now()}`,
      ttl: 20_000,
    },
  };
};

const NextReqInterceptor: RequestInterceptor = (options) => {
  return {
    ...options
    next: true
  };
};

const ResInterceptor: ResponseInterceptor = (data) => {
  return {
    ...data,
    overrided: true
  }
};

const const NextResInterceptor: ResponseInterceptor = (data) => {
  return {
    ...data,
    next: true
  }
};

const {
  CustomRest: ExampleRest,
  createCustomRestInstance: createExampleRestInstance,
} = createRest({
  cache: createCache('local'),
  // This interceptors are global, they will work for all request with this rest
  interceptors: {
    request: [ReqInterceptor],
    response: [ResInterceptor]
  },
});

const exampleRest = createOtakuReactionRestInstance('https://api.example.com');

await exampleRest.get("/path", {
  interceptors: {
    // This interceptors are local, they will work for only for this request
    request: [NextReqInterceptor],
    response: [NextResInterceptor]
  }
})

await exampleRest.get("/path", {
  interceptors: {
    // This interceptors are local, they will work for only for this request
    request: [NextReqInterceptor],
    response: [NextResInterceptor],
    // By default interceptors works only with new requests, if you want you can provide this option
    executeOnCached: true
  }
})
```

## Best practies

Recommended to create dedicated API classes:

```ts
class UserApi {
  private rest: LocalCacheRest;

  constructor() {
    this.rest = new LocalCacheRest('https://api.example.com');
  }

  async getUser(id: number) {
    return this.rest.get<User>(`/users/${id}`, {
      cache: {
        cacheKey: `user-${id}`,
        ttl: 60_000,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    await this.rest.invalidate(`user-${id}`);
    return this.rest.patch<User, UpdateUserDto>(`/users/${id}`, data);
  }
}
```

## Response Format

```ts
{
  data: T,        // Response data
  success: boolean, // Similar to response.ok
  cached: boolean   // Whether data came from cache
}
```

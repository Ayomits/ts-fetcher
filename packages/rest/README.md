# ts-fetcher

TypeScript module for convenient fetch API handling

## Features

- [x] Full type safety
- [x] Minimal boilerplate
- [x] Class-based approach

## Installation

```bash
npm install @ts-fetcher/rest
# or
yarn add @ts-fetcher/rest
# or
bun add @ts-fetcher/rest
# or
pnpm add @ts-fetcher/rest
```

## Quick start

1. Using pre-built classes <br>

```ts
import { Rest } from '@ts-fetcher/rest';

const defaultRest = new Rest('https://api.example.com');
```

2. Using factories

```ts
import { createRest, createCache } from '@ts-fetcher/rest';

const { CustomRest: LocalRest, createCustomRestInstance: createLocalRest } = createRest();

const localRest = createLocalRest('https://api.example.com');
```

## Making requests

1. Basic requests <br>

```ts
await rest.get('/data');
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

## Interceptors

You may familar with interceptors concepts in axios. They allows to mutate response/request during request lifecycle <br>

Usage:

```ts
import { createCache, createRest, RequestInterceptor, ResponseInterceptor } from '@ts-fetcher/rest';

const ReqInterceptor: RequestInterceptor = (options) => {
  return {
    ...options,
    headers: {
      Authorization: "Bearer superprivate-token"
    }
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
  }
})
```

## Response Format

```ts
{
  data: T,        // Response data
  success: boolean, // Similar to response.ok
  cached: boolean   // Whether data came from cache
}
```

# ts-fetcher

TypeScript модуль для удобной работы с fetch API

## Возможности

- [x] Поддержка различных стратегий кэширования:
  - Локальное кэширование (in-memory)
  - Redis кэширование
  - Кастомные реализации кэша
- [x] Полная типобезопасность
- [x] Минимальный бойлерплейт
- [x] Работа через классы

## Установка

```bash
npm install ts-fetcher
# или
yarn add ts-fetcher
# или
bun add ts-fetcher
# или
pnpm add ts-fetcher
```

## Быстрый старт

1. Использование готовых классов <br>

```ts
import { Rest, LocalCacheRest, RedisCacheRest, createCache } from 'ts-fetcher';

// Стандартный Rest с локальным кэшем
const defaultRest = new Rest('https://api.example.com', {
  cache: createCache('local')
});

// Специализированный класс для локального кэша
const localRest = new LocalCacheRest('https://api.example.com');

// Redis кэш (требуется ioredis)
const redisRest = new RedisCacheRest('https://api.example.com', {
  host: 'localhost',
  port: 6379,
  password: 'redis'
});
```

2. Использование фабрик <br>

```ts
import { createRest, createCache } from 'ts-fetcher';

// Создание фабрики для локального кэша
const {
  CustomRest: LocalRest,
  createCustomRestInstance: createLocalRest
} = createRest({ cache: createCache('local') });

const localRest = createLocalRest('https://api.example.com');
```

## Работа с запросами

1. Базовые запросы <br>

```ts
// Без кэширования
await rest.get('/data');

// С кэшированием
await rest.get('/data', {
  cache: {
    cacheKey: 'data-key',
    ttl: 5000 // 5 секунд
  }
});

// Инвалидация кэша
await rest.invalidate('data-key');
```

2. Типизированные запросы

```ts
interface User {
  id: number;
  name: string;
}

interface UpdateUserDto {
  name: string;
}

// Типизированный GET
const { data } = await rest.get<User>('/users/1');

// Типизированный POST/PUT/PATCH
await rest.post<User, UpdateUserDto>('/users', {
  name: 'John'
});
```

## Кастомный кеш

```ts
import { CacheService } from 'ts-fetcher';

class CustomCache implements CacheService {
  async get<T>(key: string): Promise<T | null> {
    // Ваша реализация
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    // Ваша реализация
  }

  async del(key: string): Promise<boolean> {
    // Ваша реализация
  }
}

const customRest = new Rest('https://api.example.com', {
  cache: new CustomCache()
});
```

## Interceptors

Вы могли быть знакомы с концепцией interceptors в axios. Они позволяет мутировать ответы/опции запросов <br>

Использование:

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
  // Эти interceptors работают на глобальном уровне, т.е. для каждого запроса по origin
  interceptors: {
    request: [ReqInterceptor],
    response: [ResInterceptor]
  },
});

const exampleRest = createOtakuReactionRestInstance('https://api.example.com');

await exampleRest.get("/path", {
  interceptors: {
    // Эти interceptors локальны, они сработают лишь на этом запросе
    request: [NextReqInterceptor],
    response: [NextResInterceptor]
  }
})

await exampleRest.get("/path", {
  interceptors: {
    // Эти interceptors локальны, они сработают лишь на этом запросе
    request: [NextReqInterceptor],
    response: [NextResInterceptor],
    // По умолчанию interceptors работают только для новых запросов, чтобы это изменить используйте эту опцию
    executeOnCached: true
  }
})
```

## Лучшие практики

Рекомендуется создавать отдельные классы для работы с API: <br>

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
        ttl: 60_000
      }
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    await this.rest.invalidate(`user-${id}`);
    return this.rest.patch<User, UpdateUserDto>(`/users/${id}`, data);
  }
}
```

## Формат ответов
```ts
{
  data: T,        // Данные ответа
  success: boolean, // Аналог response.ok
  cached: boolean   // Флаг из кэша ли данные
}
```

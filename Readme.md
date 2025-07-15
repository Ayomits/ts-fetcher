# ts-fetcher

The library wrapper over fetch <br>

Library has 3 main packages <br>


1. [ts-fetcher](https://www.npmjs.com/package/ts-fetcher)
2. [@ts-fetcher/cache](https://www.npmjs.com/package/@ts-fetcher/cache)
3. [@ts-fetcher/rest](https://www.npmjs.com/package/@ts-fetcher/rest)


If you want only use cache in your projects - install `@ts-fetcher/cache` <br>
If you want only use our rest wrapper - install `@ts-fetcher/rest` <br>
If you need it all - install `ts-fetcher`

Documenation links (temporary Readme.md): <br>

1. [ts-fetcher](https://github.com/Ayomits/ts-fetch/tree/main/packages/ts-fetcher)
2. [@ts-fetcher/cache](https://github.com/Ayomits/ts-fetch/tree/main/packages/cache)
3. [@ts-fetcher/rest](https://github.com/Ayomits/ts-fetch/tree/main/packages/rest)

## Contributing

1. Clone repository
```bash
git clone git@github.com:Ayomits/ts-fetch.git
# or
git clone https://github.com/Ayomits/ts-fetch.git
```

2. Install dependencies
```bash
pnpm install
```
4. Create new branch from `dev`
5. Write tests for your changes in `__tests__` folder using `.spec` prefix
6. Run tests
```bash
pnpm run test:watch
```
7. Generate changelogs and version updates
```bash
pnpm run changeset
```
8. Create fork
9. Push changes to your fork branch
10. Create pull request
11. Wait for review

## Rules

1. All your features must pass lint and testing pipeline
2. Never push untested changes

Good luck <3

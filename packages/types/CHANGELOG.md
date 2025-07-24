# @ts-fetcher/types

## 1.4.1

### Patch Changes

- Added optional onExpire option to base cache interface. It won't work in redis <3

## 1.4.0

### Minor Changes

- Added `force` option for request cache configuration <br>
  If this option provided, it will override old cache and execute http request

## 1.3.1

### Patch Changes

- Added implementations of redis and local caches rests. Also users can modify options in instances created using createRest

## 1.3.0

### Minor Changes

- Implemented refetch system and global options <br>
  Remove createCache factory <br>
  Simplified request bodies

## 1.2.1

### Patch Changes

- Metadata update

## 1.2.0

### Minor Changes

- I forget about bug... and version need to be minor bumped

## 1.1.3

### Patch Changes

- Update package metadata. Added description and removed `<br>` tag from `Readme.md` in each package

## 1.1.2

### Patch Changes

- Patch packages for using @ts-fetcher/types

## 1.1.1

### Patch Changes

- ba61094: @ts-fetcher/type becomes core package for typing everything, packages @ts-fetcher/rest and @ts-fetcher/cache uses this types

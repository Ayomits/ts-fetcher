# @ts-fetcher/cache

## 1.5.2

### Patch Changes

- Rename propety cache to caching (cache name throws error)
- Updated dependencies
  - @ts-fetcher/types@1.5.2

## 1.5.1

### Patch Changes

- Documentation updates
- Updated dependencies
  - @ts-fetcher/types@1.5.1

## 1.5.0

### Minor Changes

- The main ts-fetcher was removed, it can decrease the size of them

### Patch Changes

- Updated dependencies
  - @ts-fetcher/types@1.5.0

## 1.4.1

### Patch Changes

- Added entries, toObject, values methods (some of them from Map)

## 1.4.0

### Minor Changes

- Added optional onExpire option to base cache interface. It won't work in redis <3

## 1.3.3

### Patch Changes

- Added generics for LocalCache

## 1.3.2

### Patch Changes

- Small feature "clearAll" for local cache. Allows clear cache and intervals when needed

## 1.3.1

### Patch Changes

- Separate redis cache to single package

## 1.3.0

### Minor Changes

- Implemented refetch system and global options <br>
  Remove createCache factory <br>
  Simplified request bodies

## 1.1.3

### Patch Changes

- Metadata update

## 1.1.2

### Patch Changes

- Update package metadata. Added description and removed `<br>` tag from `Readme.md` in each package

## 1.1.1

### Patch Changes

- Patch packages for using @ts-fetcher/types

## 1.1.0

### Minor Changes

- ba61094: @ts-fetcher/type becomes core package for typing everything, packages @ts-fetcher/rest and @ts-fetcher/cache uses this types

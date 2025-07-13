import { describe, expect } from 'vitest';
import { test } from 'vitest';
import { createRest, createRestInstance, CreateRestInstanceOptions, Rest } from '../src';

const API_URL = 'https://api.example.com/';

class CustomRest extends Rest {}

describe('Create rest instance factory', () => {
  test('Create Rest instance factory', () => {
    expect(createRestInstance(API_URL)).toBeInstanceOf(Rest);
    expect(
      createRestInstance(API_URL, {
        customInstance: CustomRest,
      })
    ).toBeInstanceOf(CustomRest);
  });
});

describe('Create rest factory', () => {
  test('create empty', () => {
    const options: CreateRestInstanceOptions = {};

    const { CustomRest, createCustomRestInstance } = createRest(options);

    const instance = createCustomRestInstance(API_URL);

    expect(instance).toBeInstanceOf(Rest);

    expect(Object.getPrototypeOf(CustomRest)).toBe(Rest);

    expect(instance.get).toBeDefined();
    expect(instance.post).toBeDefined();
    expect(instance.put).toBeDefined();
    expect(instance.patch).toBeDefined();
    expect(instance.delete).toBeDefined();
    expect(instance.restOptions).toBeDefined();
    expect(instance.request).toBeDefined();
  });

  test('create from instance', () => {
    const options: CreateRestInstanceOptions = {
      customInstance: CustomRest,
    };

    const { CustomRest: CustomRestReturn, createCustomRestInstance } = createRest(options);

    const instance = createCustomRestInstance(API_URL);

    expect(instance).toBeInstanceOf(CustomRestReturn);

    expect(instance.get).toBeDefined();
    expect(instance.post).toBeDefined();
    expect(instance.put).toBeDefined();
    expect(instance.patch).toBeDefined();
    expect(instance.delete).toBeDefined();
    expect(instance.restOptions).toBeDefined();
    expect(instance.request).toBeDefined();

    const prototype = Object.getPrototypeOf(CustomRestReturn);

    expect(prototype).not.toBe(Rest);
    expect(prototype).toBe(CustomRest);
  });

  test('create instance with cache', () => {
    const options: CreateRestInstanceOptions = {
      customInstance: CustomRest,
    };

    const { CustomRest: CustomRestReturn, createCustomRestInstance } = createRest(options);

    const instance = createCustomRestInstance(API_URL);

    expect(instance).toBeInstanceOf(CustomRestReturn);

    expect(instance.get).toBeDefined();
    expect(instance.post).toBeDefined();
    expect(instance.put).toBeDefined();
    expect(instance.patch).toBeDefined();
    expect(instance.delete).toBeDefined();
    expect(instance.restOptions).toBeDefined();
    expect(instance.request).toBeDefined();

    const prototype = Object.getPrototypeOf(CustomRestReturn);

    expect(prototype).not.toBe(Rest);
    expect(prototype).toBe(CustomRest);
  });
});

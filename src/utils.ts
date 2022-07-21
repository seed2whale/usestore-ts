import { CACHE_PROPERTY_KEY } from './contants';
import { NonFunctionProperties } from './types';

type KeyType = string | symbol;

export function areEqual(a: object, b: object) {
  const keys = Reflect.ownKeys(a);
  return keys.length === Reflect.ownKeys(b).length
    && keys.every((key) => Reflect.get(a, key) === Reflect.get(b, key));
}

export function getPrototypeOf(target: object): object {
  const prototype = Reflect.getPrototypeOf(target);
  if (!prototype) {
    throw new Error('Cannot find prototype');
  }
  return prototype;
}

export function getOwnPropertyDescriptor(target: object, key: KeyType) {
  const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
  if (!descriptor) {
    throw new Error(`Property Not Found: ${String(key)}`);
  }
  return descriptor;
}

export function ownKeys(target: object) {
  return Reflect.ownKeys(target);
}

export function getGetterKeys(target: object) {
  const keys = (obj: object) => (
    Reflect.ownKeys(obj)
      .filter((key) => !String(key).startsWith('_'))
      .filter((key) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
        return descriptor?.get;
      })
  );
  return [
    ...keys(getPrototypeOf(target)),
    ...keys(getPrototypeOf(getPrototypeOf(target))),
  ];
}

export function takeSnapshot<T extends object>(
  target: T,
  propertyKeys: KeyType[],
): NonFunctionProperties<T> {
  const snapshot = propertyKeys
    .filter((key) => !String(key).startsWith('#'))
    .reduce((acc, key) => ({
      ...acc,
      [String(key)]: Reflect.get(target, key),
    }), {});
  Reflect.setPrototypeOf(snapshot, {});
  return snapshot as NonFunctionProperties<T>;
}

export function attachGetters(target: object, { obj, keys }: {
  obj: object;
  keys: KeyType[];
}) {
  const sourceProto = getPrototypeOf(obj);
  const targetProto = getPrototypeOf(target);

  Reflect.defineProperty(targetProto, CACHE_PROPERTY_KEY, {
    value: {},
  });

  keys.forEach((key) => {
    const descriptor = getOwnPropertyDescriptor(sourceProto, key);
    Reflect.defineProperty(targetProto, key, {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cache: Record<KeyType, any> = this[CACHE_PROPERTY_KEY];
        if (!(key in cache)) {
          cache[key] = descriptor.get?.apply(this);
        }
        return cache[key];
      },
    });
  });
}

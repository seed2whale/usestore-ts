/* eslint-disable no-console */

import {
  areEqual, getPrototypeOf, getOwnPropertyDescriptor,
  ownKeys, getGetterKeys, takeSnapshot, attachGetters,
} from './utils';

class Person {
  name = 'Peter Parker';

  age = 15;

  get nameAndAge() {
    return `${this.name} (${this.age})`;
  }

  get ageAndName() {
    return `${this.age} ${this.name}`;
  }

  grow() {
    this.age += 1;
  }
}

const context = describe;

let consoleError: (...args: unknown[]) => void;

beforeEach(() => {
  consoleError = console.error;
  console.error = jest.fn();
});

afterEach(() => {
  console.error = consoleError;
});

test('areEqual', () => {
  const a = { name: 'Peter Parker' };
  const b = { name: 'Peter Parker' };
  const c = { name: 'Miles Morales' };

  expect(areEqual(a, b)).toBeTruthy();
  expect(areEqual(a, c)).toBeFalsy();
});

describe('getPrototypeOf', () => {
  context('with prototype', () => {
    it('return prototype', () => {
      const proto = {};
      const obj = Object.create(proto);

      expect(getPrototypeOf(obj)).toBe(proto);
    });
  });

  context('without prototype', () => {
    it('throws error', () => {
      const nullPrototype = getPrototypeOf({});

      expect(() => {
        getPrototypeOf(nullPrototype);
      }).toThrow();
    });
  });
});

describe('getOwnPropertyDescriptor', () => {
  const person = {
    name: 'Peter Parker',
  };

  context('with valid key', () => {
    it('returns property descriptor', () => {
      const descriptor = getOwnPropertyDescriptor(person, 'name');

      expect(descriptor.value).toBe('Peter Parker');
      expect(descriptor.writable).toBeTruthy();
    });
  });

  context('with invalid key', () => {
    it('throws error', () => {
      expect(() => {
        getOwnPropertyDescriptor(person, 'xxx');
      }).toThrow();
    });
  });
});

test('ownKeys', () => {
  const person = new Person();

  expect(ownKeys(person)).toEqual(['name', 'age']);
});

test('getGetterKeys', () => {
  const person = new Person();

  expect(getGetterKeys(person)).toEqual(['nameAndAge', 'ageAndName']);
});

test('takeSnapshot', () => {
  const person = new Person();
  const keys = ownKeys(person);

  expect(takeSnapshot(person, keys)).toEqual({
    name: 'Peter Parker',
    age: 15,
  });
});

test('attachGetters', () => {
  const person = new Person();

  const snapshot = takeSnapshot(person, ownKeys(person));

  attachGetters(snapshot, { obj: person, keys: getGetterKeys(person) });

  expect(snapshot.nameAndAge).toBe('Peter Parker (15)');
});

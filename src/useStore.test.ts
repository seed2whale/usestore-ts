/* eslint-disable no-console */

import { renderHook } from '@testing-library/react';

import useStore from './useStore';

import { Store } from './decorators';

const context = describe;

@Store()
class MyStore {
  name = 'Peter';
}

describe('useStore', () => {
  context('with correct store', () => {
    it('returns the store and the state as snapshot', () => {
      const store = new MyStore();

      const { result } = renderHook(() => useStore(store));

      expect(result.current).toEqual([
        { name: 'Peter' },
        store,
      ]);
    });
  });

  context('with incorrect store', () => {
    let consoleError: (...args: unknown[]) => void;

    beforeEach(() => {
      consoleError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = consoleError;
    });

    it('throws error', () => {
      const store = {};

      expect(() => {
        renderHook(() => useStore(store));
      }).toThrow();
    });
  });
});

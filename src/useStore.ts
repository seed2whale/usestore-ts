import { useSyncExternalStore } from 'react';

import { STORE_GLUE_PROPERTY_KEY } from './contants';
import { NonFunctionProperties } from './types';

export default function useStore<Store extends object>(
  store: Store,
): [NonFunctionProperties<Store>, Readonly<Store>] {
  const glue = Reflect.get(store, STORE_GLUE_PROPERTY_KEY);
  if (!glue) {
    throw new Error('Cannot find store glue');
  }

  const snapshot = useSyncExternalStore(
    glue.subscribe.bind(glue),
    glue.getSnapshot.bind(glue),
  ) as NonFunctionProperties<Store>;

  return [snapshot, store];
}

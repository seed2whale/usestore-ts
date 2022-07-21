/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { STORE_GLUE_PROPERTY_KEY } from './contants';

import StoreGlue from './StoreGlue';

type Klass = { new (...args: any[]): {} };

export function Store() {
  return function decorator<T extends Klass>(klass: T) {
    return class extends klass {
      constructor(...args: any[]) {
        super(...args);
        const glue = new StoreGlue(this);
        Reflect.set(this, STORE_GLUE_PROPERTY_KEY, glue);
        glue.update(this);
      }
    };
  };
}

export function Action() {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const method = descriptor.value;
    descriptor.value = function decorator(...args: unknown[]) {
      const returnValue = method.apply(this, args);
      Reflect.get(this, STORE_GLUE_PROPERTY_KEY).update(this);
      return returnValue;
    };
  };
}

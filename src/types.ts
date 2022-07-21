/* eslint-disable @typescript-eslint/no-explicit-any */

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T];

export type NonFunctionProperties<T> = Omit<T, FunctionPropertyNames<T>>;

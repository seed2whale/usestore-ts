import StoreGlue from './StoreGlue';

import { Store } from './decorators';

@Store()
class MyStore {
  name: string;

  constructor({ name }: {
    name: string;
  }) {
    this.name = name;
  }
}

test('StoreGlue', () => {
  const name = 'Peter Parker';
  const handleChange = jest.fn();

  const target = new MyStore({ name });

  const glue = new StoreGlue(target);

  glue.subscribe(handleChange);

  glue.update(target);

  const snapshot = {
    name,
  };

  expect(handleChange).toBeCalled();

  expect(glue.getSnapshot()).toEqual(snapshot);
});

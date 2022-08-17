import { render, screen, act } from '@testing-library/react';

import { Store, Action, useStore } from '.';

@Store()
class MyStore {
  name = '';

  get displayName() {
    return this.name.toUpperCase();
  }

  @Action()
  changeName(name: string) {
    this.name = name;
  }
}

function MyComponent({ store }: {
  store: MyStore;
}) {
  const [{ name, displayName }] = useStore(store);

  return (
    <div>
      <div>{name}</div>
      <div>{displayName}</div>
    </div>
  );
}

test('example', () => {
  const store = new MyStore();

  render((
    <MyComponent store={store} />
  ));

  act(() => {
    store.changeName('Peter Parker');
  });

  screen.getByText('Peter Parker');
  screen.getByText('PETER PARKER');
});

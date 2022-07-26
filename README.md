# usestore-ts - React state management library

## Installation

```bash
npm install usestore-ts
```

## Configure TypeScript

Edit `tsconfig.json` to use decorators:

```json
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
```

## Example

```tsx
import { Store, Action, useStore } from 'usestore-ts';

@Store()
class CounterStore {
  count = 0;

  @Action()
  increase() {
    this.count += 1;
  }

  @Action()
  reset() {
    this.count = 0;
  }
}

const counterStore = new CounterStore();

export default function Counter() {
  const [{ count }, store] = useStore(counterStore);

  return (
    <div>
      <p>
        Count:
        {' '}
        {count}
      </p>
      <p>
        <button type="button" onClick={() => store.increase()}>
          Increase
        </button>
        <button type="button" onClick={() => store.reset()}>
          Reset
        </button>
      </p>
    </div>
  )
}
```

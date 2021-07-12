### Make a Service: steps
- [ ] [Write the interface](README.md#interface)
- [ ] [Write the service implementation](README.md#implementation)
- [ ] [Register the service in main](README.md#register-the-service)
- [ ] [Register the service in renderer](README.md#register-the-service)
- [ ] [Use the service](README.md#instantiation)

**Tips**: You can copy/paste the [skeleton](services/skeleton) folder for a quick start.

### Example with an `observer`
An observer is an object for which all functions are notifications.

#### Interfaces
```typescript
import { observer } from 'services/lib/helpers';
import { RPC } from 'services/lib/types';
import { ServiceBase } from 'services/lib/class';

@service('my-service')
export class MyService extends ServiceBase implements RPC.Interface<MyService> {
  // @ts-ignore current class is an empty shell, so TS is not happy
  // but we also uses it as an Interface.
  // @ts-ignore
  addObserver(obs: MyServiceObserver): Promise<RPC.Subscription> {}
}

@service('my-service', { observer: true }) // same namespace
export class MyServiceObserver extends ServiceBase implements RPC.Interface<MyServiceObserver> {
  // @ts-ignore
  onClick(): void {}
  // @ts-ignore
  onHover(): void {}
}
```

#### Implementation
##### callback style
```typescript
export class MyServiceImpl extends MyService implements RPC.Interface<MyService> {
  addObserver(obs: RPC.ObserverNode<MyServiceObserver>) {
    const subscriptions = [];
    if (obs.onClick) {
      const fn = () => {
        obs.onClick();
      }
      someEventEmitter.on('click', fn);
      subscriptions.push(() => {
        someEventEmitter.removeEventListener('click', fn)
      })
    }
    
    if (obs.onHover) {
      const fn = () => {
        obs.onHover();
      }
      someEventEmitter.on('hover', fn);
      subscriptions.push(() => {
        someEventEmitter.removeEventListener('hover', fn)
      })
    }
    
    // The second parameter allows us to sync the destruction of the subscription and the observer:
    // - if `unsubscribe()` is called, `obs.destroy()` is called
    // - if `obs.destroy()` is called, `unsubscribe()` is called
    return new ServiceSubscription(subscriptions, obs);
  }
}
```

##### observable style
```typescript
export class MyServiceImpl extends MyService implements RPC.Interface<MyService> {
  addObserver(obs: RPC.ObserverNode<MyServiceObserver>) {
    const subscriptions = [];
    if (obs.onClick) {
      subscriptions.push(fromEvent(someEventEmitter, 'click')
        .subscribe(() => {
          obs.onClick();
        })
      );
    }
    
    if (obs.onHover) {
      subscriptions.push(fromEvent(someEventEmitter, 'click')
        .subscribe(() => {
          obs.onHover();
        })
      );
    }
    
    return new ServiceSubscription(subscriptions, obs);
  }
}
```

#### Registration
1. See [services/main/index](main/index.ts) and [services/renderer/index](renderer/index.ts)
2. Add the new service type to `GlobalService` type in [services/types](types.ts)

#### Usage
```typescript
const myService: RPC.Node<MyService>;

// Here, the `observer` helper converts its parameter to an actual Service,
// which allows it to be serialized.
const subscription = myService.addObserver(observer({
  onClick() {/* ... */},
  onHover() {/* ... */},
}));


// ...later, you can manually unsubscribe
subscription.unsubscribe();
```

### Example with a `provider`
A provider allows us to inject dependencies into a Service implementation,
and thus delegate some logic to another process.

#### Interfaces
```typescript
import { observer } from 'services/lib/helpers';
import { RPC } from 'services/lib/types';
import { ServiceBase } from 'services/lib/class';

@service('my-service')
export class MyService extends ServiceBase implements RPC.Interface<MyService> {
  // @ts-ignore
  addProvider(provider: MyServiceProvider): Promise<RPC.Subscription> {}
}

// A Provider is just a normal Service
@service('my-service')
export class MyServiceProvider extends ServiceBase implements RPC.Interface<MyServiceProvider> {
  // @ts-ignore
  handleSomething(): Promise<string> {} // Contrary to observers, providers should return values
}
```

#### Implementation
##### _Handler_ side (Service Implementation)
```typescript
export class MyServiceImpl extends MyService implements RPC.Interface<MyService> {
  async addProvider(provider: MyServiceProvider) {
    // do things
    // ...
    // then delegate to provider
    
    const value = await provider.handleSomething();
    
    // Do something with `value`
    // ...
    
    // Unplug it here if necessary
    return new ServiceSubscription(...);
  }
}
```

##### _Provider_ side
```typescript
export class MyServiceProviderImpl extends MyServiceProvider implements RPC.Interface<MyServiceProvider> {
  async handleSomething() {
    // Here for instance we are in the worker,
    // We could want to fetch something from the store:
    
    const value = myRandomSelector(this.store.getState());
    
    // This is the value that the handler will use
    return value;
  }
}
```

#### Usage
```typescript
const myService: RPC.Node<MyService>; // or it could come from servicesManager
const subscription = myService.addProvider(new MyServiceProviderImpl());


// ...later, you can manually unsubscribe
subscription.unsubscribe();
```

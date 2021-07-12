import { sortBy, nth } from 'ramda';
import { react } from '@getstation/sdk';
import { ComponentClass } from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Rx from 'rxjs/Rx';
import { AbstractProvider, DefaultMap } from '../common';

type OrderedComponentClass = [number, ComponentClass];
type LinkedComponent = Map<string, OrderedComponentClass>;

export default class ReactProvider extends AbstractProvider<react.ReactConsumer> {
  public portals: DefaultMap<string, BehaviorSubject<ComponentClass[]>>;
  protected linkedComponents: WeakMap<react.ReactConsumer, LinkedComponent>;

  constructor() {
    super();
    this.portals = new DefaultMap(() => new Rx.BehaviorSubject(null));
    this.linkedComponents = new WeakMap();
  }

  addConsumer(consumer: react.ReactConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface(consumer));
    super.subscribeConsumer(consumer, () => {});
  }

  getProviderInterface(consumer: react.ReactConsumer): react.ReactProviderInterface {
    return {
      createPortal: (children: ComponentClass, id: react.ValidPortalIds, position?: number) =>
        this.createPortal(consumer, children, id, position || 0),
    };
  }

  createPortal(consumer: react.ReactConsumer, children: ComponentClass, id: react.ValidPortalIds, position: number) {
    this
      .getComponentsMapForConsumer(consumer)
      .set(id, [position, children]); // Add Component to this consumer for given portal id
    // Retrieve all components of all consumers for given portal id
    const allUnorderedChildren: OrderedComponentClass[] = this._consumers
      .map(c => this.linkedComponents.get(c))
      .filter(m => m !== undefined && m.get(id) !== undefined)
      .map(m => m!.get(id)! as OrderedComponentClass);

    const allChildren = sortBy((x) => x[0], allUnorderedChildren).map(x => x[1]);
    // Update Observable with the new array of Components
    this.portals.get(`portal-${id}`).next(allChildren);
  }

  /**
   * For a given consumer, returns a map from which the keys are portals ids,
   * and the values are a React Component Class.
   * @param {react.ReactConsumer} consumer
   * @returns {Map<string, React.ComponentClass>}
   */
  protected getComponentsMapForConsumer(consumer: react.ReactConsumer): LinkedComponent {
    if (!this.linkedComponents.has(consumer)) {
      this.linkedComponents.set(consumer, new Map());
    }
    return this.linkedComponents.get(consumer)!;
  }
}

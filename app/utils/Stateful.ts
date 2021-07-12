import { Transformer } from './fp';

/**
 * This class represents a Stateful container
 * The goal here is to avoid the traditional `let` mutable state variable
 * It's a bit like a redux store, but without async stuff and indirections caused by actions
 *
 * In the future, maybe we would plan to add:
 * - functional setState (https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b)
 * - some protected method to mock the behavior of this class in unit tests
 * - observable state
 */
export default class Stateful<T extends object> {
  private state: T;
  private readonly initialState: T;

  /**
   * Create a Stateful container of type T
   *
   * @param {T} state
   */
  constructor(state: T) {
    this.state = state;
    this.initialState = state;
  }

  /**
   * Get the initial state (the one given to the constructor)
   *
   * @returns {T}
   */
  getInitialState(): T {
    return this.initialState;
  }

  /**
   * Get the current state
   *
   * @returns {T}
   */
  getState(): T {
    return this.state;
  }

  /**
   * Mutate the state replacing it by a new state
   *
   * @param {T} newState
   */
  replaceState(newState: T): void {
    this.state = newState;
  }

  /**
   * Mutate the state "ala" react
   *
   * @param {Partial<T> | Transformer<T>} updates
   */
  setState(updates: Partial<T> | Transformer<T>): void {
    if (typeof updates === 'function') {
      this.state = updates(this.state);
    } else {
      this.state = Object.assign({}, this.state, updates);
    }
  }

  /**
   * Replace the current state by the initial state (the one given to the constructor)
   */
  resetState(): void {
    this.state = this.initialState;
  }
}

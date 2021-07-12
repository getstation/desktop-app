import Stateful from '../../../app/utils/Stateful';

type Dummy = {
  a: string,
  b: number,
};

describe('utils:Stateful', () => {
  const dummyState: Dummy = { a: 'hello', b: 42 };
  const container: Stateful<Dummy> = new Stateful(dummyState);

  afterEach(() => {
    container.resetState();
  });

  it('should return the same reference for initialState', () => {
    expect(container.getState()).toBe(dummyState);
    container.setState({ a: '', b: 0 });
    expect(container.getInitialState()).toBe(dummyState);
    container.resetState();
    expect(container.getState()).toBe(dummyState);
  });

  it('should set partial state', () => {
    container.setState({ a: 'hello world' });
    expect(container.getState()).toEqual({ ...dummyState, a: 'hello world' });
    container.setState({ a: 'hello world', b: -42 });
    expect(container.getState()).toEqual({ a: 'hello world', b: -42 });
  });

  it('should set the entire state', () => {
    container.setState({ a: '', b: 0 });
    expect(container.getState()).toEqual({ a: '', b: 0 });
  });

  it('should get the same reference given object when replace state', () => {
    const nextDummyState: Dummy = { a: 'ftafion', b: 666 };
    container.replaceState(nextDummyState);
    expect(container.getState()).toBe(nextDummyState);
  });
});

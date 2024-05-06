import { ServiceBase } from '../../../src/services/lib/class';
import { observer } from '../../../src/services/lib/helpers';

describe('observer', () => {
  it('should check that observer is a usable Service', () => {
    const subject1 = {
      onSomething() {
        return 'bla';
      },
    };
    const Osubject1 = observer(subject1);

    expect(Osubject1).toBeInstanceOf(ServiceBase);
    expect(typeof Osubject1.onSomething).toBe('function');
    expect(Osubject1.onSomething()).toBe('bla');
  });
});

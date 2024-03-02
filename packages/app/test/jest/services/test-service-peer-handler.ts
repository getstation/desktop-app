import { ServicePeerHandler } from '../../../app/services/lib/class';
import { getChannelMock, getPeerMock, TestService, TestServiceImpl } from './mock';

describe('ServicePeerhandler', () => {
  let channel: ReturnType<typeof getChannelMock>;

  beforeEach(() => {
    channel = getChannelMock();
  });

  it('should connect given services', () => {
    const sph = new ServicePeerHandler(channel);
    const s1 = new TestService('__default__');
    const s2 = new TestServiceImpl('__default2__');

    sph.connect(s1);
    sph.connect(s2);
    expect(sph.isConnected('test:__default__')).toBe(true);
    expect(sph.isConnected('test:__default2__')).toBe(true);
  });

  it('should register request handlers', () => {
    const sph = new ServicePeerHandler(channel);
    const s = new TestServiceImpl('__default__');

    sph.connect(s);
    const peer: ReturnType<typeof getPeerMock> = channel.peer.mock.results[0].value;
    expect(peer.setRequestHandler.mock.calls[0][0]).toEqual('test:getName');
    expect(peer.setRequestHandler.mock.calls[1][0]).toEqual('test:throwError');
    expect(peer.setRequestHandler.mock.calls[2][0]).toEqual('test:addObserver');
  });

  it('should not bind requests if no constructor is given', () => {
    const sph = new ServicePeerHandler(channel);
    const s = new TestService('__default__');

    sph.connect(s);
    expect(Reflect.getOwnPropertyDescriptor(s, 'getName')).toBeUndefined();
    expect(Reflect.getOwnPropertyDescriptor(s, 'throwError')).toBeUndefined();
    expect(Reflect.getOwnPropertyDescriptor(s, 'addObserver')).toBeUndefined();
  });

  it('should bind requests if constructor is given', () => {
    const sph = new ServicePeerHandler(channel);
    const s = new TestService('__default__');

    sph.connect(s, TestService);
    expect(Reflect.getOwnPropertyDescriptor(s, 'getName')).toHaveProperty('configurable', false);
    expect(Reflect.getOwnPropertyDescriptor(s, 'throwError')).toHaveProperty('configurable', false);
    expect(Reflect.getOwnPropertyDescriptor(s, 'addObserver')).toHaveProperty('configurable', false);
  });
});

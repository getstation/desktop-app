import { RPCChannelPeer } from 'stream-json-rpc';
import { ServicePeer } from '../../../app/services/lib/class';
import { getNode } from '../../../app/services/lib/getNode';
import { getPeerMock, setPeer, TestService } from './mock';

describe('getNode', () => {
  let peerMock: RPCChannelPeer;

  beforeEach(() => {
    peerMock = getPeerMock();
  });

  it('should throw because Node is not connected', () => {
    const node = new (getNode(TestService))();

    expect(node).toBeInstanceOf(ServicePeer);
    expect(() => node.getName()).toThrow('not connected');
  });

  it('should have no remote properties', () => {
    const node = new (getNode(TestService))();
    setPeer(node, peerMock);

    expect('getName' in node).toBe(false);
  });

  it('should have remote properties', () => {
    const node = new (getNode(TestService, ['getName']))();
    setPeer(node, peerMock);

    expect('getName' in node).toBe(true);
    expect(node).toHaveProperty('getName');
    expect(node).not.toHaveProperty('getNothing');
  });

  it('should return getName result', async () => {
    const node = new (getNode(TestService, ['getName']))();
    setPeer(node, peerMock);

    expect(await node.getName()).toEqual('test');
  });
});

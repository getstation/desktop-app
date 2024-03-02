import { ipcRenderer } from 'electron';
import { ElectronIpcRendererDuplex } from 'stream-electron-ipc';
import rpcchannel, { RPCChannel } from 'stream-json-rpc';
import { ServiceBase, ServicePeerHandler } from '../../../app/services/lib/class';
import { getNode } from '../../../app/services/lib/getNode';
import { observer } from '../../../app/services/lib/helpers';
import { TestService } from './mock/common';
import { JsonRpcError } from 'json-rpc-protocol';
import { TestServiceProviderImpl } from './mock/renderer';

describe('browserX SDK IPC', () => {
  let dummyServiceNode: TestService;
  let dummyServiceNode2: TestService;
  let channel: RPCChannel;
  let sph: ServicePeerHandler;

  before(() => {
    const duplex = new ElectronIpcRendererDuplex(0, 'bx-test');
    channel = rpcchannel(duplex);
    sph = new ServicePeerHandler(channel, false);

    dummyServiceNode = new (getNode(TestService))('__test__');
    dummyServiceNode2 = new (getNode(TestService))('__test2__');
    sph.connect(dummyServiceNode);
    sph.connect(dummyServiceNode2);
  });

  it('should return name from implementation', async () => {
    const name = await dummyServiceNode.getName();
    if (name !== 'test') {
      throw new Error(`Unknown name ${name}`);
    }
  });

  it('should return throw an error', async () => {
    try {
      await dummyServiceNode.throwError();
    } catch (e) {
      if (!(e instanceof JsonRpcError)) {
        throw e;
      }
      return;
    }
    throw new Error('Should have throw an error');
  });

  it('should leverage observer in implementation', (done) => {
    dummyServiceNode.addObserver(observer({
      onTest(param: any) {
        if (param.test === 'TestService addObserver onTest called') {
          return done();
        }
        done(new Error(`Unkown value for param: ${JSON.stringify(param)}`));
      },
    })).catch(done);
  });

  it('should return a subscription Service', (done) => {
    dummyServiceNode.addObserver(observer({
      onTest() {},
    })).then(sub => {
      if (!(sub instanceof ServiceBase)) return done(new Error('sub is not instanceof ServiceBase'));
      if (!(typeof sub.unsubscribe === 'function')) return done(new Error('sub.unsubscribe is not a function'));
      return done();
    }).catch(done);
  });

  it('should add up all given numbers', (done) => {
    dummyServiceNode
      .reduceAdd(1, 2, 3, 4, 5)
      .then((result) => {
        if (result === 15) {
          return done();
        }
        done(new Error(`Value should have been 15, ${result} received`));
      })
      .catch(done);
  });

  it('should be able to use given provider', (done) => {
    dummyServiceNode
      .setProvider(new TestServiceProviderImpl())
      .then(() => dummyServiceNode.getValueFromProvider())
      .then(value => {
        if (value === 'I am test') {
          return done();
        }
        done(new Error(`Received ${value} instead of "I am test"`));
      })
      .catch(done);
  });

  it('should propagate the destruction of the service node to the other process', (done) => {
    dummyServiceNode.destroy();
    if (sph.isConnected(dummyServiceNode)) {
      return done(new Error('Service node should not be connected after destruction'));
    }
    setTimeout(() => {
      const isRemoteConnected = ipcRenderer.sendSync('ask-is-connected-sync');
      if (isRemoteConnected) {
        return done(new Error('Remote peer should not be connected after destruction'));
      }
      return done();
    }, 200);
  });

  it('should propagate the destruction of the service from the other process', (done) => {
    ipcRenderer.sendSync('ask-destroy-sync');
    setTimeout(() => {
      if (sph.isConnected(dummyServiceNode2)) {
        return done(new Error('Service node should not be connected after destruction'));
      }
      return done();
    }, 200);
  });
});

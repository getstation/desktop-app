import { ipcMain, ipcRenderer } from 'electron';
import { Duplex } from 'stream';

const GET_CURRENT_WEB_CONTENTS_ID = 'stream-electron-ipc.get-current-web-contents-id';

const isRenderer = process.type === 'renderer';

const getSenderId = (e: any) => typeof e.senderId === 'number' ? e.senderId :
    typeof e.sender.id === 'number' ? e.sender.id : 0;

const getFullChannel = (channel: string, webContentsId: number) => `sei-${channel}-${webContentsId}`;

if (!isRenderer) {
  ipcMain.on(GET_CURRENT_WEB_CONTENTS_ID, (event: Electron.IpcMainEvent) => {
      console.log(`[DEBUG] IPC: GET_CURRENT_WEB_CONTENTS_ID from sender: ${event.sender.id}`);
      event.returnValue = event.sender.id;
    });
}

// Main Process Class
export class ElectronIpcMainDuplex extends Duplex {

  private static activeMainInstances = new Map<number, Set<ElectronIpcMainDuplex>>();
  private static idCounter = 0;
  private static activeListeners = new Map<string, (_: any, data: Uint8Array) => void>();
  webContents: Electron.WebContents;
  wcId: number;
  channel: string;
  id: number;
  private _msgListener: (_: any, data: Uint8Array) => void;
  private _listenChannel: string;
  private _onClose: () => void;
  private _wasDestroyed: boolean = false;

  constructor(webContents: Electron.WebContents, channel: string = 'data') {
      super();
      this.webContents = webContents;
      this.wcId = webContents.id;
      this.channel = getFullChannel(channel, 0);
      this.id = ++ElectronIpcMainDuplex.idCounter;

        // Track instance for cleanup on webContents destruction
      let instances = ElectronIpcMainDuplex.activeMainInstances.get(this.wcId);
      if (!instances) {
          instances = new Set();
          ElectronIpcMainDuplex.activeMainInstances.set(this.wcId, instances);

          webContents.once('destroyed', () => {
              const remaining = ElectronIpcMainDuplex.activeMainInstances.get(this.wcId);
              if (remaining) {
                  console.log(`[DEBUG] WebContents ${this.wcId} destroyed, cleaning up ${remaining.size} IPC duplexes`);
                  for (const instance of remaining) {
                      try {
                          instance.destroy();
                        } catch (e) { }
                    }
                  ElectronIpcMainDuplex.activeMainInstances.delete(this.wcId);
                }
            });
        }
      instances.add(this);

      if (webContents.getMaxListeners() < 100) {
          webContents.setMaxListeners(100);
        }

      this._listenChannel = getFullChannel(channel, this.wcId);

        // PREVENT LEAK: Cleanup previous listener for same channel
      if (ElectronIpcMainDuplex.activeListeners.has(this._listenChannel)) {
          const oldListener = ElectronIpcMainDuplex.activeListeners.get(this._listenChannel);
          if (oldListener) {
              ipcMain.removeListener(this._listenChannel, oldListener);
            }
        }

      this._msgListener = (_: any, data: Uint8Array) => {
          if (Buffer.isBuffer(data) || data instanceof Uint8Array) {
              this.push(data);
            }
        };
      ElectronIpcMainDuplex.activeListeners.set(this._listenChannel, this._msgListener);
      ipcMain.on(this._listenChannel, this._msgListener);

      this._onClose = () => {
          this.end();
        };

      this.webContents.once('close' as any, this._onClose);
      this.on('close', () => {
          if (this.webContents && !this.webContents.isDestroyed()) {
              this.webContents.removeListener('close' as any, this._onClose);
            }
        });

        // init connection
      if (!this.webContents.isDestroyed()) {
          this.webContents.send(channel);
        }
    }

  _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void) {
      if (this.webContents && !this.webContents.isDestroyed()) {
          this.webContents.send(this.channel, new Uint8Array(chunk));
        }
      callback();
    }

  _read(_size: number) { }

  _destroy(err: Error | null, callback: (error: Error | null) => void) {
      if (this._wasDestroyed) return;
      this._wasDestroyed = true;

      if (this._msgListener && this._listenChannel) {
          ipcMain.removeListener(this._listenChannel, this._msgListener);
          ElectronIpcMainDuplex.activeListeners.delete(this._listenChannel);
        }

      const instances = ElectronIpcMainDuplex.activeMainInstances.get(this.wcId);
      if (instances) {
          instances.delete(this);
          if (instances.size === 0) {
              ElectronIpcMainDuplex.activeMainInstances.delete(this.wcId);
            }
        }

      callback(err);
    }
}

// Renderer Process Class (Patched)
const activeListeners = new Map<string, (...args: any[]) => void>();

export class ElectronIpcRendererDuplex extends Duplex {
  wcId: number;
  sendTo: (channel: string, ...args: any[]) => void;
  channel: string;
  private _msgListener: (...args: any[]) => void;
  private _listenChannel: string;

  constructor(webContentsId?: number, channel: string = 'data') {
      super();
      console.log(`[DEBUG] ElectronIpcRendererDuplex created for channel: ${channel}, targetId: ${webContentsId}`);
      console.trace('[DEBUG] Trace for ElectronIpcRendererDuplex creation');
      this.wcId = typeof webContentsId === 'number' ? webContentsId : 0;

        // Try to get current ID from main, or fallback
      let currentWebContentsId = 0;
      try {
          if (ipcRenderer) {
              currentWebContentsId = ipcRenderer.sendSync(GET_CURRENT_WEB_CONTENTS_ID);
            }
        } catch (e) {
          console.warn('ElectronIpcRendererDuplex: Failed to get current WC ID via sendSync', e);
            // Ideally we should handle this, but for now let's hope it works or we don't need it if logic differs
        }

      this.channel = getFullChannel(channel, currentWebContentsId);

      if (this.wcId === 0) {
            // renderer to main - Use standard send
          this.sendTo = ipcRenderer.send.bind(ipcRenderer);
        } else {
            // renderer to renderer - PROXY FIX
            // Instead of sendTo, we use our proxy 'bx-api-response' which forwards to 'channel' on 'targetId'
          this.sendTo = (channel: string, ...args: any[]) => {
              ipcRenderer.send('bx-api-response', this.wcId, channel, ...args);
            };
        }

      this._listenChannel = getFullChannel(channel, this.wcId);

        // Automatic cleanup of previous listeners for this channel to prevent leaks (HMR/Reloads)
      if (activeListeners.has(this._listenChannel)) {
          const oldListener = activeListeners.get(this._listenChannel);
          if (oldListener) {
              ipcRenderer.removeListener(this._listenChannel, oldListener);
            }
          activeListeners.delete(this._listenChannel);
        }

        // Message listener handles both direct messages and proxied messages
        // Proxied messages have format: { __senderId: number }, actualData
      this._msgListener = (_: any, firstArg: any, ...rest: any[]) => {
          let data: any;
            // If first arg is the __senderId wrapper, actual data is in rest
          if (firstArg && typeof firstArg === 'object' && typeof firstArg.__senderId === 'number') {
              data = rest[0]; // The actual data is the next argument
            } else {
              data = firstArg;
            }
          if (data !== undefined) {
              this.push(data);
            }
        };

      activeListeners.set(this._listenChannel, this._msgListener);
      ipcRenderer.on(this._listenChannel, this._msgListener);

        // init connection
      this.sendTo(channel);
    }

    _write(chunk: Buffer, _encoding: any, callback: Function) {
      this.sendTo(this.channel, new Uint8Array(chunk));
      callback();
    }

    _read(_size: any) { }

  _destroy(err: Error | null, callback: (error: Error | null) => void) {
      if (this._msgListener && this._listenChannel) {
          ipcRenderer.removeListener(this._listenChannel, this._msgListener);
          activeListeners.delete(this._listenChannel);
        }
      callback(err);
    }
}

export const firstConnectionHandler = (callback: (socket: Duplex) => void, channel?: string) => {
  const seensIds = new Set<number>();
  console.log(`[DEBUG] firstConnectionHandler initialized for channel: ${channel || 'data'}`);

  (isRenderer ? ipcRenderer : ipcMain).on(channel || 'data', (e: any, data: any, ..._rest: any[]) => {
        // When messages come through the Main process proxy, the first arg may contain __senderId
        // This tells us the original sender's webContentsId for proper reply routing
      let senderId = getSenderId(e);

        // Check if data contains __senderId (proxied message from Main)
      if (data && typeof data === 'object' && typeof data.__senderId === 'number') {
          senderId = data.__senderId;
          console.log(`[DEBUG] Extracted __senderId from proxied message: ${senderId}`);
        }

      const pid = process.pid;
      const type = process.type;
      console.log(`[DEBUG] [${type}:${pid}] firstConnectionHandler: Received msg on ${channel || 'data'} from senderId: ${senderId}`);

        // FIXED: Always check seensIds to prevent infinite connection loops.
        // Previously, this check was only done when channel was undefined (default 'data').
        // This caused infinite loops when a channel was specified because the init
        // response from ElectronIpcMainDuplex would trigger a new connection in the Worker.
      if (seensIds.has(senderId)) {
          console.log(`[DEBUG] [${type}:${pid}] Skipping senderId ${senderId} (already seen)`);
          return;
        }
      console.log(`[DEBUG] [${type}:${pid}] New connection from senderId ${senderId}`);
      seensIds.add(senderId);

      let duplex: Duplex;
      if (isRenderer) {
          duplex = new ElectronIpcRendererDuplex(senderId, channel || 'data');
        } else {
            // @ts-ignore: e.sender is WebContents
          duplex = new ElectronIpcMainDuplex(e.sender, channel || 'data');
        }
        // Only push initial data for default channel (legacy behavior)
      if (!channel) {
          duplex.push(data);
        }
      callback(duplex);
    });
};

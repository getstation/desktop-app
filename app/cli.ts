import { ipcRenderer /*, remote */ } from 'electron';
import { app as remoteApp, getCurrentWebContents as remoteGetCurrentWebContents } from '@electron/remote';

const exit = () => remoteApp.exit(0);

const commands: Record<string, Function> = {
  database(args: any[]) {
    return require('./database/cli').exec(args);
  },
};

ipcRenderer.on('command', async (_e, command: string, ...args: string[]) => {
  try {
    await commands[command](args);
    exit();
  } catch (e) {
    console.error(e);
    remoteGetCurrentWebContents().openDevTools();
  }
});

// mock sdk.ipc because ipcMain and ipcRenderer are not available in jest
jest.mock('../app/sdk/ipc/IpcProvider');

jest.setTimeout(30000);

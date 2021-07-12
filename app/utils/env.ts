let _isPackaged = process.env.NODE_ENV !== 'test';

if (!['storybook', 'test'].includes(process.env.NODE_ENV!)) {
  const { app, remote } = require('electron');
  _isPackaged = Boolean(process.type === 'renderer' ? remote.app.isPackaged : app.isPackaged);
}

export const isPackaged = _isPackaged;

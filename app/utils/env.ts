let _isPackaged = process.env.NODE_ENV !== 'test';

if (!['storybook', 'test'].includes(process.env.NODE_ENV!)) {
  _isPackaged = Boolean(
      process.type === 'renderer' 
          ? require('@electron/remote').app.isPackaged 
          : require('electron').app.isPackaged
  );
}

export const isPackaged = _isPackaged;

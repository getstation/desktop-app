export const isDarwin = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';

export const fullPlatform = isDarwin ? `${process.platform}_${process.arch}` : process.platform;

export const osName = (() => {
  switch (process.platform) {
    case 'darwin':
      return 'MacOS';
    case 'linux':
      return 'Linux';
    case 'win32':
      return 'Windows';
    default:
      return process.platform;
  }
})();

export const isWindows7 = () => {
  return process.platform === 'win32' && process.getSystemVersion().startsWith('6.');
}

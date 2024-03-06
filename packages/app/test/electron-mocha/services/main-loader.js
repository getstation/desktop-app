require('ts-node').register({
  transpileOnly: true,
  logError: true,
  compilerOptions: {
    allowJs: true,
  }
});
require('./main-require');


exports.default = async function(context) {

  const { appOutDir, targets } = context;

  const isLinux = targets.find(target => target.name === 'appImage');
  if (!isLinux) {
    return;
  }
  
  const fs = require('fs-extra');
  const originalDir = process.cwd();
  
  process.chdir(appOutDir);

  fs.moveSync('station-desktop-app', 'station-desktop-app.bin');

  const wrapperScript = 
  `#!/bin/sh
if [ -z \${WAYLAND_DISPLAY+x} ]; then 
  WAYLAND_PARAMS=""
else 
  WAYLAND_PARAMS="--enable-features=UseOzonePlatform --ozone-platform=wayland"
fi
nohup "$(dirname "$(readlink -f "$0")")/station-desktop-app.bin" \$WAYLAND_PARAMS --no-sandbox "$@" >/dev/null 2>&1 &
      `;
    fs.writeFileSync('station-desktop-app', wrapperScript);
  fs.chmodSync('station-desktop-app', '755');

  process.chdir(originalDir);
}

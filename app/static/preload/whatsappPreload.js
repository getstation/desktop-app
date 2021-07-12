let snoozed = false;
const originalPlay = Audio.prototype.play;

const shouldBypassSnooze = (audio) => audio.src.startsWith('blob:http');

Audio.prototype.play = function() {
  if (!snoozed || shouldBypassSnooze(this)) {
    return originalPlay.call(this);
  }
  return Promise.resolve();
};

window.bx.notificationCenter.snoozeDurationInMs.subscribe(duration => snoozed = Boolean(duration));

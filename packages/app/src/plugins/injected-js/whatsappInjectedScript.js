
//vk: moved from whatsappPreload.js

let snoozed = false;
const originalPlay = Audio.prototype.play;

const shouldBypassSnooze = (audio) => audio.src.startsWith('blob:http');

Audio.prototype.play = function() {
  if (!snoozed || shouldBypassSnooze(this)) {
    return originalPlay.call(this);
  }
  return Promise.resolve();
};

window.bx.notificationCenter.addSnoozeDurationInMsChangeListener((_, duration) => {
  snoozed = Boolean(duration);
});

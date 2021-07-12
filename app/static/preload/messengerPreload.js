const turnOffAudioElement = element => element.volume = 0;
const turnOnAudioElement = element => element.volume = 1;
const isAudioNode = node => node.tagName === "AUDIO";

const turnOffAudioVolumeObserver = target => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      Array.from(mutation.addedNodes)
        .filter(isAudioNode)
        .forEach(turnOffAudioElement);
    });
  });

  const config = { attributes: true, childList: true };

  Array.from(target.querySelectorAll('audio')).forEach(turnOffAudioElement);
  observer.observe(target, config);

  return () => observer.disconnect();
};

let disconnectTurnOffAudioVolumeObserver;

window.bx.notificationCenter.snoozeDurationInMs.subscribe(duration => {
  if (duration && !document.location.pathname.includes('/videocall/incall/')) {
    disconnectTurnOffAudioVolumeObserver = turnOffAudioVolumeObserver(document.body);
  } else {
    if (disconnectTurnOffAudioVolumeObserver) {
      disconnectTurnOffAudioVolumeObserver();
    }
    document.querySelectorAll('audio').forEach(turnOnAudioElement)
  }
});

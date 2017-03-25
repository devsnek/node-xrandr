const xrandr = require('./');

const sleep = (x) => new Promise(r => setTimeout(r, x));

// sets brightness to 2.0, rotates screen left
// waits seven seconds
// puts it all back

xrandr().then(async (displays) => {
  const current = displays.find(d => d.connected);
  current.setBrightness(2.0);
  current.setRotation('left');
  await sleep(7000);
  current.setBrightness(1.0);
  current.setRotation('normal');
});

const childProcess = require('child_process');
const parseXrandr = require('./parser');

function exec(...args) {
  return new Promise((resolve, reject) => {
    childProcess.exec(...args, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

module.exports = () =>
  exec('xrandr').then(parseXrandr)
  .then((devices) => Object.entries(devices).map(([k, v]) => new Display(k, v)));

function xexec(display, prop, rest) {
  return exec(`xrandr --output ${display} --${prop} ${rest}`).then(() => true);
}

class Display {
  constructor(name, data) {
    this.name = name;
    this.connected = data.connected;
    this.modes = data.modes || null;
    this.rotation = data.rotation || null;
    this.width = data.width || null;
    this.height = data.height || null;
    this.realSize = data.realSize || null;
  }

  setGamma(x, y, z) {
    if (arguments.length === 1) {
      y = x;
      z = x;
    }
    return xexec(this.name, 'gamma', `${x}:${y}:${z}`);
  }

  setBrightness(brightness) {
    return xexec(this.name, 'brightness', brightness);
  }

  setRotation(rotation) {
    return xexec(this.name, 'rotate', rotation);
  }

  setProperty(prop, value) {
    return xexec(this.name, 'set', `${prop} ${value}`);
  }

  setRate(rate) {
    return xexec(this.name, 'rate', rate);
  }
}

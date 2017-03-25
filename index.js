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
    return this._exec('gamma', `${x}:${y}:${z}`);
  }

  setBrightness(brightness) {
    return this._exec('brightness', brightness);
  }

  setRotation(rotation) {
    return this._exec('rotate', rotation);
  }

  setProperty(prop, value) {
    return this._exec('set', `${prop} ${value}`);
  }

  setRate(rate) {
    return this._exec('rate', rate);
  }

  _exec(prop, rest) {
    return exec(`xrandr --output ${this.name} --${prop} ${rest}`).then(() => true);
  }
}

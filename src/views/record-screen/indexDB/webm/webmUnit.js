import WebmBase from './webmBase';

export default class WebmUint extends WebmBase {
  constructor(name, type) {
    super(name, type || 'Uint');
  }

  updateBySource() {
    // use hex representation of a number instead of number value
    this.data = '';
    for (let i = 0; i < this.source.length; i++) {
      let hex = this.source[i].toString(16);
      this.data += WebmUint.padHex(hex);
    }
  }

  updateByData() {
    let length = this.data.length / 2;
    this.source = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      let hex = this.data.substr(i * 2, 2);
      this.source[i] = parseInt(hex, 16);
    }
  }

  getValue() {
    return parseInt(this.data, 16);
  }

  setValue(value) {
    this.setData(WebmUint.padHex(value.toString(16)));
  }
}

WebmUint.padHex = function (hex) {
  return hex.length % 2 === 1 ? '0' + hex : hex;
};
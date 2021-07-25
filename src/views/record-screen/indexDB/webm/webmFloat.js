import WebmBase from './webmBase';

export default class WebmFloat extends WebmBase {
  constructor(name, type) {
    super(name, type || 'Float');
  }

  getFloatArrayType() {
    return this.source && this.source.length === 4
      ? Float32Array
      : Float64Array;
  }

  updateBySource() {
    let byteArray = this.source.reverse();
    let floatArrayType = this.getFloatArrayType();
    let floatArray = new floatArrayType(byteArray.buffer);
    this.data = floatArray[0];
  }

  updateByData() {
    let floatArrayType = this.getFloatArrayType();
    let floatArray = new floatArrayType([this.data]);
    let byteArray = new Uint8Array(floatArray.buffer);
    this.source = byteArray.reverse();
  }

  getValue() {
    return this.data;
  }

  setValue(value) {
    this.setData(value);
  }
}
import WebmBase from './webmBase';
import Constants from '../constants.js';
import WebmFloat from './webmFloat';
import WebmUint from './webmUnit';

export default class WebmContainer extends WebmBase {
  constructor(name, type) {
    super(name, type || 'Container');
  }

  readByte() {
    return this.source[this.offset++];
  }

  readUint() {
    let firstByte = this.readByte();
    let bytes = 8 - firstByte.toString(2).length;
    let value = firstByte - (1 << (7 - bytes));
    for (let i = 0; i < bytes; i++) {
      // don't use bit operators to support x86
      value *= 256;
      value += this.readByte();
    }
    return value;
  }

  updateBySource() {
    this.data = [];

    for (this.offset = 0; this.offset < this.source.length; this.offset = end) {
      let id = this.readUint();
      let len = this.readUint();
      let end = Math.min(this.offset + len, this.source.length);
      let data = this.source.slice(this.offset, end);

      let info = Constants.SECTIONS[id] || { name: 'Unknown', type: 'Unknown' };
      let ctr = WebmBase;
      switch (info.type) {
        case 'Container':
          ctr = WebmContainer;
          break;
        case 'Uint':
          ctr = WebmUint;
          break;
        case 'Float':
          ctr = WebmFloat;
          break;
      }
      let section = new ctr(info.name, info.type);
      section.setSource(data);
      this.data.push({
        id: id,
        idHex: id.toString(16),
        data: section,
      });
    }
  }

  writeUint(x, draft) {
    for (
      let bytes = 1, flag = 0x80;
      x >= flag && bytes < 8;
      bytes++, flag *= 0x80
    ) {
      console.log(22);
    }

    if (!draft) {
      let value = flag + x;
      for (let i = bytes - 1; i >= 0; i--) {
        // don't use bit operators to support x86
        let c = value % 256;
        this.source[this.offset + i] = c;
        value = (value - c) / 256;
      }
    }

    this.offset += bytes;
  }

  writeSections(draft) {
    this.offset = 0;
    for (let i = 0; i < this.data.length; i++) {
      let section = this.data[i],
        content = section.data.source,
        contentLength = content.length;
      this.writeUint(section.id, draft);
      this.writeUint(contentLength, draft);
      if (!draft) {
        this.source.set(content, this.offset);
      }
      this.offset += contentLength;
    }
    return this.offset;
  }

  updateByData() {
    // run without accessing this.source to determine total length - need to know it to create Uint8Array
    let length = this.writeSections('draft');
    this.source = new Uint8Array(length);
    // now really write data
    this.writeSections();
  }

  getSectionById(id) {
    for (let i = 0; i < this.data.length; i++) {
      let section = this.data[i];
      if (section.id === id) {
        return section.data;
      }
    }
    return null;
  }
}
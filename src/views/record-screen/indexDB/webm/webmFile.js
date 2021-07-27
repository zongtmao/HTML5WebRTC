import WebmContainer from './webmContainer';
import WebmFloat from './webmFloat';

export default class WebmFile extends WebmContainer {
  /**
   * @param {Uint8Array|ArrayBuffer} source  Webm bytearray
   */
  constructor(source) {
    super('File', 'File');
    let data;
    if (source instanceof ArrayBuffer) {
      data = new Uint8Array(source);
    } else if (source instanceof Uint8Array) {
      data = source;
    } else {
      throw new Error(
        '参数错误，来源必须是 Uint8Array 或 ArrayBuffer'
      );
    }
    this.setSource(data);
  }

  fixDuration(duration) {
    var segmentSection = this.getSectionById(0x8538067);
    if (!segmentSection) {
      return false;
    }

    var infoSection = segmentSection.getSectionById(0x549a966);
    if (!infoSection) {
      console.error('[fix-webm-duration] 缺少信息部分');
      return false;
    }

    var timeScaleSection = infoSection.getSectionById(0xad7b1);
    if (!timeScaleSection) {
      console.error('[fix-webm-duration] 缺少时间码刻度部分');
      return false;
    }

    var durationSection = infoSection.getSectionById(0x489);
    if (durationSection) {
      if (durationSection.getValue() <= 0) {
        durationSection.setValue(duration);
        console.debug(
          '[fix-webm-duration] Duration 部分存在，但值为空'
        );
      } else {
        return false;
      }
    } else {
      durationSection = new WebmFloat('Duration', 'Float');
      durationSection.setValue(duration);
      infoSection.data.push({
        id: 0x489,
        data: durationSection,
      });

      console.debug('[fix-webm-duration] 缺少Duration');
    }

    // 将默认时间刻度设置为 1 毫秒（1000000 纳秒）
    timeScaleSection.setValue(1000000);
    infoSection.updateByData();
    segmentSection.updateByData();
    this.updateByData();

    return true;
  }

  toBlob() {
    return new Blob([this.source.buffer], { type: 'video/webm' });
  }
}
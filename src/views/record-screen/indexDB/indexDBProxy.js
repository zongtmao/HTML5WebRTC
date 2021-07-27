import Proxy from './proxy.js';
import Dexie from 'dexie';
import DateHelper from './dateHelper.js';
import WebmFile from './webm/webmFile.js';
import Constants from './constants.js';

/**
 * 封装IndexDBProxy基础类
 */
class IndexedDBProxy extends Proxy {
  constructor() {
    let db = new Dexie(Constants.IndexedDBName);
    db.version(1).stores({
      recorded_videos: '++id,video_id,video_name,data,timecode',
    });
    super(Constants.ProxyNames.INDEXEDDB_PROXY, { db: db });
  }

  // 保存数据，字段与constructor中的对应
  saveData(video_id, data, timecode) {
    this.data.db.recorded_videos.put({ video_id, data, timecode });
  }

  // 读取indexDB里的文件信息
  async readRecordedVideoLib() {
    let arr = await this.data.db.recorded_videos.toArray();

    let grouped = new Map();
    for (let v of arr) {
      let savedV = grouped.get(v.video_id);
      if (!savedV) {
        grouped.set(v.video_id, v);
      }
    }
    return grouped;
  }

  // 修改indexDB里视频name
  async renameVideo(video_id, video_name) {
    await this.data.db.recorded_videos
      .where({ video_id })
      .modify({ video_name });
  }

  // 删除indexDB里视频
  async deleteVideo(video_id) {
    await this.data.db.recorded_videos
      .where('video_id')
      .anyOf(video_id)
      .delete();
  }

  // 录制视频导出
  async exportVideo(video_id, mode = 'download') {
    let filterResult = await this.data.db.recorded_videos.filter(
      (item) => item.video_id == video_id
    );
    let records = await filterResult.toArray();
    let blobs = [];
    let video_name = '';
    if (records.length) {
      video_name = records[0].video_name;
    }
    for (let r of records) {
      blobs.push(r.data);
    }
    let blob = new Blob(blobs, { type: 'video/webm' });

    let end = records[blobs.length - 1],
      start = records[0];
    if (end && end.timecode && start && start.timecode) {
      let duration = end.timecode - start.timecode;
      if (!isNaN(duration)) {
        let webmf = new WebmFile(await blob.arrayBuffer());
        if (webmf.fixDuration(Math.abs(duration))) {
          blob = webmf.toBlob();
        }
      }
    }

    if (mode == 'download') {
      // 通过原生a标签下载
      let url = window.URL.createObjectURL(blob);
      let filename =
        (video_name || DateHelper.getReadableTimestamp()) + '.webm';
      let aDom = document.createElement('a');
      aDom.innerHTML = filename;
      aDom.setAttribute('style', 'display: none;');
      aDom.setAttribute('href', url);
      aDom.setAttribute('target', '_blank');
      aDom.setAttribute('download', filename);

      document.querySelector('body').append(aDom);
      aDom.click();
      window.URL.revokeObjectURL(url);
      aDom.remove();
    } else if (mode == 'preview') {
      // 抛出视频 blob数据
      return blob;
    }
  }
}

export default IndexedDBProxy;
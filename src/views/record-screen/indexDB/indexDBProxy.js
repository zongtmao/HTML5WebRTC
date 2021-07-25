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

  async reloadRecordedVideos() {
    this.sendNotification(
      Constants.Commands.RECORDED_VIDEOS_RELOADED,
      await this.readRecordedVideoLib()
    );
  }

  // 删除indexDB里视频
  async deleteVideo(video_id) {
    await this.data.db.recorded_videos
      .where('video_id')
      .anyOf(video_id)
      .delete();
  }

  async exportVideo(video_id, mode = 'download') {
    let pd = Dialog.showLoading('正在导出...');
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
    pd.modal('hide');

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
      let url = window.URL.createObjectURL(blob);
      let filename =
        (video_name || DateHelper.getReadableTimestamp()) + '.webm';
      let a = $(
        `<a style='display: none;' href="${url}" target="_blank" download="${filename}">${filename}</a>`
      );
      $('body').append(a);
      a[0].click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else if (mode == 'preview') {
      VideoPreviewDialog.show(blob, video_name || video_id);
    }
  }
}

export default IndexedDBProxy;
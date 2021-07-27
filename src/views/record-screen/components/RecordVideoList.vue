<template>
  <div class="record-video-list-wrap">
    <label class="list-title">Video List</label>
    <div class="video-list-content" v-if="videoLists.length">
      <div class="video-item" v-for="(item, index) in videoLists" :key="index">
        <div class="video-name">{{ item.video_name || item.video_id }}</div>
        <div class="operate-btn">
          <el-button
            @click="videoPlayHandle(item.video_id)"
            size="small"
            type="primary"
            >Play</el-button
          >
          <el-button
            @click="videoEditNameHandle(item.video_id, item.video_name)"
            size="small"
            type="primary"
            >Edit Name</el-button
          >
          <el-button
            @click="videoDownloaDHandle(item.video_id)"
            size="small"
            type="primary"
            >Download</el-button
          >
          <el-button
            @click="videoDeleteHandle(item.video_id)"
            size="small"
            type="danger"
            >Delete</el-button
          >
        </div>
      </div>
    </div>

    <div v-else class="no-record-video">暂无录制的视频</div>
    <!-- 预览播放 -->
    <el-dialog
      title="Video Play"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <video
        class="recorded-video"
        :src="videoBlobUrl"
        autoplay
        controls
      ></video>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >Close</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IndexedDBProxy from '../indexDB/indexDBProxy.js';

export default {
  name: 'RecordVideoList',
  props: {
    needRequest: Boolean,
  },
  data() {
    return {
      videoLists: [],
      dbProxy: null,
      dialogVisible: false,
      videoBlobUrl: '',
    };
  },
  mounted() {
    this.dbProxy = new IndexedDBProxy();
    this.getVideoListForDB();
  },
  watch: {
    videoLists(newValue) {
      this.videoLists = newValue;
    },
    needRequest(needRequest) {
      // 录制完成后获取列表
      needRequest ? this.getVideoListForDB() : '';
    },
  },
  methods: {
    async getVideoListForDB() {
      // 返回列表map数据
      let videoListMap = await this.dbProxy.readRecordedVideoLib();
      console.log(videoListMap);
      while (this.videoLists.length) {
        this.videoLists.pop();
      }

      for (let [k, v] of videoListMap) {
        this.videoLists.splice(0, 0, v);
      }
    },

    // blob视频播放
    async videoPlayHandle(videoId) {
      this.dialogVisible = true;
      let videoBolb = await this.dbProxy.exportVideo(videoId, 'preview');
      this.videoBlobUrl = URL.createObjectURL(videoBolb);

      console.log(this.videoBlobUrl);
    },

    // 修改IndexDB中视频名
    videoEditNameHandle(videoId, videoName) {
      this.$prompt('Edit video name', 'Tip', {
        inputValue: videoName || videoId,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      }).then(({ value }) => {
        value.trim() ? this.setVideoNameForDB(videoId, value) : '';
      });
    },
    async setVideoNameForDB(videoId, videoName) {
      await this.dbProxy.renameVideo(videoId, videoName);
      this.getVideoListForDB();
      this.$message({
        type: 'success',
        message: 'Success',
      });
    },

    // 删除IndexDB中视频
    videoDeleteHandle(videoId) {
      this.$confirm('Are you sure to delete this video?', 'Tips', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.dbProxy.deleteVideo(videoId);
        this.getVideoListForDB();
        this.$message({
          type: 'success',
          message: 'Success',
        });
      });
    },

    // 下载webm
    videoDownloaDHandle(videoId) {
      // exportVideo 方法默认导出，预览时第二参数preview
      this.dbProxy.exportVideo(videoId);
    },
  },
};
</script>

<style lang="scss" scoped>
.record-video-list-wrap {
  margin-top: 20px;
  .list-title {
    font-weight: 700;
    font-size: 18px;
  }
  .video-list-content {
    margin-top: 10px;
  }
  .no-record-video {
    margin-top: 200px;
  }

  .video-list-content {
    .video-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      border: 1px solid #ddd;
      padding: 0 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
    }
  }
  .recorded-video {
    width: 100%;
    max-height: 500px;
  }
}
</style>
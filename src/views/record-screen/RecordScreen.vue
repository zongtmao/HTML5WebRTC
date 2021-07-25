<template>
  <div class="record-screen-wrap">
    <el-alert
      title="屏幕录制，使用indexDB本地存储方案"
      type="success"
      center
      :closable="false">
    </el-alert>

    <div class="audio-choose">
      <label style="margin: 0 0.5rem 0 0" class="font-weight-bold">
        {{ audioInputLabel }}
        <input type="checkbox" v-model="includeAudio" />
      </label>

      <el-select v-model="selectedDeviceId" :disabled="!includeAudio" clearable placeholder="请选择">
        <el-option
          v-for="(item, index) in devices"
          :key="item.deviceId"
          :label="item.label"
          :value="index">
          {{ item.label || item.deviceId }}
        </el-option>
      </el-select>
      <el-button v-if="!recording" class="record" @click="startRecord" type="danger">Start Record</el-button>
      <el-button v-else class="record" @click="stopRecord" type="danger">Stop Record</el-button>
    </div>

    <RecordVideoList />
  </div>
</template>

<script>
  import ViewEvents from './libs/ViewEvents.js';
  import DateHelper from './indexDB/dateHelper.js';
  import IndexedDBProxy from './indexDB/indexDBProxy.js';
  import RecordVideoList from './components/RecordVideoList.vue'

  export default {
    name: 'RecordScreen',
    components: {
      RecordVideoList,
    },
    data() {
      return {
        audioInputLabel: '音频输入',
        includeAudio: true,
        selectedDeviceId: 0,
        devices: [],
        recording: false,
        mediaRecord: null,
        mediaStream: null
      }
    },
    mounted () {
      // 获取音频数据
      this.initAudioData();
    },
    methods: {
      async initAudioData() {
        let audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        for (let strack of audioStream.getTracks()) {
          strack.stop();
        }

        this.updateDevicesList();
        navigator.mediaDevices.ondevicechange = this.mediaDevicesChangeHandler.bind(this);
      },

      mediaDevicesChangeHandler() {
        this.updateDevicesList();
      },

      async updateDevicesList() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        this.setDevices(devices.filter(d => d.kind == 'audioinput'));
      },

      setDevices(devices) {
        while (this.devices.length) {
          this.devices.pop();
        }
        this.devices.push(...devices);
        this.selectedDeviceId = 0;
      },

      // 开始录制
      async startRecord() {
        try {
          let stream = new MediaStream();

          if (this.includeAudio) {
            let audioStream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: this.devices[this.selectedDeviceId],
            });
            for (let t of audioStream.getTracks()) {
              stream.addTrack(t);
            }
          }

          let screenStream = await navigator.mediaDevices.getDisplayMedia();
          for (let t of screenStream.getTracks()) {
            stream.addTrack(t);
          }

          this.mediaStream = stream;
          this.mediaRecord = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' });
          this.mediaRecord.currentVideoId = DateHelper.getReadableTimestamp() + "_" + Date.now();
          this.mediaRecord.ondataavailable = this.ondataavailableHandler.bind(this);
          this.mediaRecord.onstop = this.recorderStopedHandler.bind(this);
          this.mediaRecord.start(3000);
          this.recording = true;
          console.log(stream);
        } catch (err) {
          console.log(err);
        }
      },

      // 暂停录制
      stopRecord() {
        this.mediaRecord.stop();
        this.$emit(ViewEvents.REQUEST_TO_STOP_RECORD);
        this.recording = false;
      },

      ondataavailableHandler(e) {
        console.debug(e);
        let dbProxy = new IndexedDBProxy();
        dbProxy.saveData(this.mediaRecord.currentVideoId, e.data, e.timecode || e.timeStamp);
      },

      recorderStopedHandler() {
        if (this.mediaStream) {
          for (let t of this.mediaStream.getTracks()) {
            t.stop();
          }
        }

        this.mediaStream = null;
      }
    },
  }
</script>

<style lang="scss" scoped>
.audio-choose {
  margin-top: 20px;
  .record {
    margin-left: 10px;
  }
}
</style>
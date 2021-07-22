<template>
    <div class="record-audio-wrap">
        <div class="operate-btn">
            <el-button :disabled="recording" @click="recordHandle" type="primary">Record</el-button>
            <el-button :disabled="paused || !recording" @click="pauseHandle" type="primary">Pause</el-button>
            <el-button :disabled="!paused || !recording" @click="resumeHandle" type="primary">Resume</el-button>
            <el-button :disabled="!recording" @click="stopHandle" type="primary">Stop</el-button>
            <el-button :disabled="!currentWebmData" @click="playHandle" type="primary">Play</el-button>
        </div>

        <div class="audio-play">
            <audio ref="audioPlay" controls autoplay></audio>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RecordAuido",

        data() {
            return {
                mediaStream: null,
                mediaRecord: null,
                currentWebmData: null,
                recording: false,
                paused: false
            }
        },

        methods: {
            async recordHandle() {
                // 初始化录制构造函数
                this.mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });

                this.mediaRecord = new MediaRecorder(this.mediaStream, {
                    mimeType: "video/webm;codecs=h264"
                });

                // 数据可用时回调
                this.mediaRecord.ondataavailable = this.recordDataavailableHandle.bind(this);

                // 启动
                this.mediaRecord.start();
                this.recording = true;
            },

            recordDataavailableHandle(e) {
                console.log(e);
                this.currentWebmData = e.data;
            },

            pauseHandle() {
                this.paused = true;
                this.mediaRecord.pause();
            },

            resumeHandle() {
                this.paused = false;
                this.mediaRecord.resume();
            },

            stopHandle() {
                this.recording = false;
                this.mediaRecord.stop();
            },

            playHandle() {
                this.$refs.audioPlay.src = URL.createObjectURL(this.currentWebmData);
            }
        },
    }
</script>

<style lang="scss" scoped>
.audio-play {
    margin-top: 20px;
}
</style>
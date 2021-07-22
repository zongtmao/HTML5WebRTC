<template>
    <div class="use-microphone-wrap">
        <el-alert
            title="使用麦克风demo"
            type="success"
            center
            :closable="false">
        </el-alert>

        <div class="audio-play">
            <audio ref="audio" controls></audio>
        </div>

        <div class="device-list">
            <el-select v-model="selectedDeviceId">
                <el-option
                    v-for="(device, index) in audioDevicesList"
                    :key="index"
                    :label="device.label"
                    :value="index">
                </el-option>
            </el-select>

            <el-button class="get-btn" @click="getAudio" type="primary">GET AUDIO</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UseMicrophone",
        data() {
            return {
                selectedDeviceId: 0,
                audioDevicesList: []
            }
        },

        watch: {
            selectedDeviceId() {
                this.showAudioDevice();
            }
        },

        methods: {
            getAudio() {
                this.initAudioData();
            },

            async initAudioData() {
                let devices = await navigator.mediaDevices.enumerateDevices();
                let audioInputDevices = devices.filter(item => item.kind === 'audioinput');
                console.log(audioInputDevices);
                
                this.audioDevicesList.length = 0;
                this.audioDevicesList.push(...audioInputDevices);

                this.showAudioDevice();
            },

            async showAudioDevice() {
                let devicesInfo = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: this.audioDevicesList[this.selectedDeviceId]
                });

                // 获得的流文件赋值到audio标签
                this.$refs.audio.srcObject = devicesInfo;
            }
        },
    }
</script>

<style lang="scss" scoped>
.audio-play {
    margin: 20px 0;
}
.get-btn {
    margin-left: 10px;
}
</style>
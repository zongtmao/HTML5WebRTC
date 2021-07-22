<template>
    <div class="use-camera-wrap">
        <el-alert
            title="使用摄像头Demo"
            type="success"
            center
            :closable="false">
        </el-alert>

        <div class="video-play">
            <video ref="myVideo" controls autoplay width="400" height="300"></video>
            <canvas ref="canvas" width="400" height="300"></canvas>
        </div>

        <div class="operate-content">
            <el-button class="get-video" @click="getVideo" type="primary">GET Video</el-button>
            <el-button class="get-video" @click="takeAPhoto" type="error">Take a photo</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UseCamera",

        data() {
            return {
                canvasContext2d: ""
            }
        },

        methods: {
            async getVideo() {
                // 获取摄像头，填充到video标签
                this.$refs.myVideo.srcObject = await navigator.mediaDevices.getUserMedia(
                    {
                        video: true,
                        audio: false
                    }
                );

                this.canvasContext2d = this.$refs.canvas.getContext("2d");
                console.log(this.canvasContext2d);
            },

            takeAPhoto() {
                // canvas上绘制图像
                this.canvasContext2d.drawImage(this.$refs.myVideo, 0, 0, 400, 300);
            }
        },
    }
</script>

<style lang="scss" scoped>
.video-play {
    display: flex;
}

.operate-content {
    margin-top: 20px;
}
</style>
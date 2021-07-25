<template>
    <div class="record-video-list-wrap">
        <label class="list-title">Video List</label>
        <div class="video-list-content" v-if="videoLists.length">
            <div class="video-item"
                v-for="(item, index) in videoLists"
                :key="index"
            >
                <div class="video-name">{{ item.video_name || item.video_id }}</div>
                <div class="operate-btn">
                    <el-button @click="videoPlayHandle" type="primary">Play</el-button>
                    <el-button @click="videoPlayHandle" type="primary">Edit Name</el-button>
                    <el-button @click="videoPlayHandle" type="primary">Download</el-button>
                    <el-button @click="videoPlayHandle" type="danger">Delete</el-button>
                </div>
            </div>
        </div>

        <div v-else class="no-record-video">
            暂无录制的视频
        </div>
    </div>
</template>

<script>
import IndexedDBProxy from '../indexDB/indexDBProxy.js';

export default {
    name: "RecordVideoList",
    data() {
        return {
            videoLists: []
        }
    },
    mounted () {
        this.getVideoListForDB();
    },
    watch: {
        videoLists(newValue) {
            this.videoLists = newValue;
        }
    },
    methods: {
        async getVideoListForDB() {
            let videoListMap = await new IndexedDBProxy().readRecordedVideoLib();
            console.log(this.videoLists.length);
            while (this.videoLists.length) {
                this.videoLists.pop();
            }

            for (let [k, v] of videoListMap) {
                this.videoLists.splice(0, 0, v);
            }
        },
        videoPlayHandle() {

        }
    },
}
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
}
</style>
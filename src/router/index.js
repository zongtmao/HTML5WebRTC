import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/components/Layout.vue"),
  },
  {
    path: "/microphone",
    name: "microphone",
    component: () => import("@/views/microphone/UseMicrophone.vue"),
  },
  {
    path: "/camera",
    name: "camera",
    component: () => import("@/views/camera/UseCamera.vue"),
  },
  {
    path: "/audio",
    name: "audio",
    component: () => import("@/views/record-audio/RecordAudio.vue"),
  },
  {
    path: "/video",
    name: "video",
    component: () => import("@/views/record-video/RecordVideo.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

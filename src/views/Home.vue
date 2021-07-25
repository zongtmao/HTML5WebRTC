<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :router="true" :default-openeds="['1', '2']">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-message"></i>Devices</template
          >
          <el-menu-item-group>
            <el-menu-item index="microphone">Microphone</el-menu-item>
            <el-menu-item index="camera">Camera</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title"
            ><i class="el-icon-menu"></i>Record</template
          >
          <el-menu-item-group>
            <el-menu-item index="audio">Record Audio</el-menu-item>
            <el-menu-item index="video">Record Video</el-menu-item>
            <el-menu-item index="screen">Record Screen</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>set</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>webrtc</span>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style lang="scss">
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

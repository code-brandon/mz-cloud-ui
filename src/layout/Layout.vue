<template>
  <el-container class="layout-main">
    <!-- hidden-sm-and-down -->
    <div v-if="mobileSize && !collapse" class="drawer-bg" @click="handleClickOutside">{{ mobileSize && !collapse }}</div>
    <vSidebar class=""> </vSidebar>
    <el-container class="layout-body" :class="classObj">
      <vHead>Header</vHead>
      <div class="content-box">
        <v-tags></v-tags>
      </div>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsList">
            <!--  v-if="$route.meta.keepAlive" -->
            <router-view v-if="isHttp" :key="fullPath"></router-view>
            <!-- <router-view :key="fullPath"></router-view> -->
            <!-- <InnerLink v-else  src="https://pythonjishu.com/hckddbhxzwcbspu/"></InnerLink> -->
            <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
            <IframeViews v-else></IframeViews>
          </keep-alive>
        </transition>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import InnerLink from './components/InnerLink.vue'
import IframeViews from './components/IframeViews.vue'
import vHead from './components/Header.vue'; // 头部导航
import vSidebar from './components/Sidebar.vue'; // 侧边栏
import vTags from './components/Tags.vue'; // 路由标签栏
import bus from './components/Bus'; // Vue组件通信中eventBus的使用
import {isURL} from 'utils/mz-utils.js'
export default {
  // 组件名称
  name: 'Layout',
  data() {
    return {
      tagsList: [],
      collapse: true,
      hideSidebar: false,
      mobileSize: false,
      dialog: true,
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags,
    InnerLink,
    IframeViews
  },
  methods: {
    handleClickOutside() {
      bus.$emit('collapse', true);
    },
  },
  computed: {
    fullPath() {
      return this.$route.fullPath;
    },
    isHttp(){
      console.log(this.$route);
      console.log(this.$route.path);
      console.log(isURL(this.$route.path));
      return !isURL(this.$route.name)
    },
    classObj() {
      return {
        hideSidebar: this.mobileSize,
        collapseSidebar: this.mobileSize ? false : this.collapse,
      };
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg;
    });

    bus.$on('hideSidebar', (msg) => {
      this.hideSidebar = msg;
    });

    bus.$on('mobileSize', (msg) => {
      this.mobileSize = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name&& msg[i].keepAlive && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  /**
   * 实例销毁之前调用。在这一步，实例仍然完全可用。
   */
  beforeDestroy() {
    bus.$off();
  },
};
</script>

<style lang="less" scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /*text-align: center;*/
  overflow: unset;
  /*line-height: 160px;*/
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.layout-main {
  height: 100vh;
}
.layout-body {
  // overflow: auto;
  height: 100%;
  -webkit-transition: margin-left 0.28s;
  transition: margin-left 0.28s;
  margin-left: 200px;
  position: relative;
}
</style>

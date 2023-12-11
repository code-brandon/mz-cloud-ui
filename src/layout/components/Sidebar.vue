<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/6/23 22:43
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <!-- :style="`width: ${collapse ? '' : '200px'}`" hideSidebar-->
  <div class="sidebar" :class="mobileSize && collapse ? 'hideSidebar' : ''">
    <el-menu class="sidebar-el-menu" :class="collapse ? 'collapseSidebar' : ''" @open="handleOpen" @close="handleClose" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router mode="vertical">
      <el-menu-item index="/" key="/">
        <i class="el-icon-data-analysis"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <SidebarItem v-for="(item, index) in asynMenu" :itemMenu="item" :key="index"></SidebarItem>
    </el-menu>
  </div>
</template>

<script>
import bus from './Bus';
import SidebarItem from './SidebarItem';

export default {
  // 组件名称
  name: 'Sidebar',
  components: {
    SidebarItem,
  },
  data() {
    return {
      collapse: false,
      hideSidebar: false,
      mobileSize: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    filterMenus(item) {
      let arr = item
        .filter((to) => {
          return !to.hidden;
        })
        .map((to) => {
          if (to.children && to.children.length > 0) {
            to.children = this.filterMenus(to.children);
          }
          return to;
        });
      return arr;
    },
  },
  computed: {
    onRoutes() {
      return this.$route.path;
      // return this.$route.path.replace('/', '');;
    },
    asynMenu() {
      let that = this;
      let menus = this.$store.state.tab.menus;
      let arr = that.filterMenus(menus);
      return arr;
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg;
    });
    bus.$on('mobileSize', (msg) => {
      this.mobileSize = msg;
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

<style lang="less">
.sidebar-el-menu {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  width: 200px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
.sidebar .el-menu--collapse .el-submenu > .el-submenu__title > span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.sidebar > .el-menu.hideSidebar .el-submenu .el-submenu__title {
  background-color: #324157 !important;
}
.sidebar > .el-menu .el-menu--inline li.el-menu-item,
.sidebar > .el-menu .el-submenu .el-submenu__title {
  background-color: #1f2d3d !important;
}
.sidebar > .el-menu .el-menu--inline li.el-menu-item:hover,
.sidebar > .el-menu .el-submenu .el-submenu__title:hover {
  background-color: #273644 !important;
}
.el-menu--collapse > div > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
.el-menu--collapse > div > .el-submenu.is-active .el-submenu__title * {
  color: #409eff;
}
.el-submenu__title .svg-icon {
  color: #909399;
}
</style>

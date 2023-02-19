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
  <div class="sidebar" :style="`width: ${collapse ? '' : '170px'}`">
    <el-menu
            class="sidebar-el-menu"
            @open="handleOpen"
            @close="handleClose"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
            mode="vertical"
    >
      <SidebarItem v-for="(item,index) in asynMenu" :itemMenu="item" :key="index"></SidebarItem>
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
      SidebarItem
    },
    data() {
      return {
        collapse: false,
      };
    },
    methods:{
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      filterMenus(item){
        let arr =  item.filter(to=>{
          return !to.hidden;
        }).map(to=>{
          if (to.children && to.children.length > 0) {
            to.children =  this.filterMenus(to.children);
          }
          return to;
        })
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
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      });
    }
  };
</script>

<style lang="less">
  .sidebar-el-menu {
    height: 100%;
  }
  .sidebar .el-menu--collapse .el-submenu>.el-submenu__title>span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .sidebar .el-menu--collapse .el-submenu>.el-submenu__title>.el-submenu__icon-arrow.el-icon-arrow-right{
    display: none;
  }
  .sidebar> .el-menu .el-menu--inline li.el-menu-item{
    background-color: #1f2d3d !important;
  }
  .sidebar> .el-menu .el-menu--inline li.el-menu-item:hover{
    background-color: #273644 !important;
  }
  .el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: auto !important;
  }


</style>

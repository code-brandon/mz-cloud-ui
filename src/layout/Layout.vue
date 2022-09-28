<template>
  <el-container class="layout-main">
    <vSidebar> </vSidebar>
    <el-container class="layout-body">
      <vHead>Header</vHead>
      <div class="content-box" :class="{'content-collapse':collapse}">
        <v-tags></v-tags>
      </div>
      <el-main>
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import vHead from './components/Header.vue'; // 头部导航
  import vSidebar from './components/Sidebar.vue'; // 侧边栏
  import vTags from './components/Tags.vue'; // 路由标签栏
  import bus from './components/Bus'; // Vue组件通信中eventBus的使用
  export default {
    data() {
      return {
        tagsList: [],
        collapse: false
      };
    },
    components: {
      vHead,
      vSidebar,
      vTags
    },
    created() {
      bus.$on('collapse-content', msg => {
        this.collapse = msg;
      });
      // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      bus.$on('tags', msg => {
        let arr = [];
        for (let i = 0, len = msg.length; i < len; i++) {
          msg[i].name && arr.push(msg[i].name);
        }
        this.tagsList = arr;
      });
    }
  };
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .sidebar {
    min-height: 100vh;
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    transition: width .28s;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
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
  .layout-main{
    height: 100vh;
  }
  .layout-body{
    /*min-height: 100%;*/
    /*overflow-y: scroll;*/
    overflow: auto;
  }
</style>

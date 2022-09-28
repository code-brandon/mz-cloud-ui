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
  <div class="sidebar">
    <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
    >
      <template v-for="item in asynMenu">
        <template v-if="item.children&&item.children.length>0">
          <el-submenu :index="item.path" :key="item.name">
            <template slot="title">
              <i :class="'el-icon-'+item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                      v-if="subItem.children&&subItem.children.length>0"
                      :index="item.path+'/'+subItem.path"
                      :key="item.name+'/'+subItem.name"
              >
                <i :class="'el-icon-'+subItem.meta.icon"></i>
                <template slot="title">{{ subItem.meta.title }}</template>
                <el-menu-item
                        v-for="(threeItem,i) in subItem.children"
                        :key="subItem.path+'/'+threeItem.path"
                        :index="subItem.path+'/'+threeItem.path"
                >
                  <i :class="'el-icon-'+threeItem.meta.icon"></i>
                  {{ subItem.path+'/'+threeItem.path }}
                </el-menu-item>
              </el-submenu>
              <!--根据index进行跳转-->
              <el-menu-item
                      v-else
                      :index="item.path+'/'+subItem.path"
                      :key="item.name+'/'+subItem.name"
              >
                <i :class="'el-icon-'+subItem.meta.icon"></i>
                {{ subItem.meta.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.name" :key="item.path">
            <i :class="'el-icon-'+item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from './Bus';

  export default {
    data() {
      return {
        collapse: false,
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path;
        // return this.$route.path.replace('/', '');;
      },
      asynMenu() {
        return this.$store.state.tab.menus;
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
        bus.$emit('collapse-content', msg);
      });
    }
  };
</script>

<style lang="less" scoped>
  .sidebar-el-menu {
    height: 100%;
    text-align: left;
    width: 200px;
    min-height: 400px;
  }
</style>

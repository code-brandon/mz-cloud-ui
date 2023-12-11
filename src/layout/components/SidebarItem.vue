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
  <div>
    <!-- 外层 -->
      <el-submenu v-if="itemMenu.children && itemMenu.children.length>0" :index="parentPath+itemMenu.path" :key="itemMenu.name">
        <template slot="title">
          <!-- <i :class="itemMenu.meta.icon"></i> -->
          <MzIcon :allName="itemMenu.meta.icon"  />
          <span>{{itemMenu.meta.title}}</span>
        </template>
        <!-- 内嵌 -->
        <SidebarItem v-for="(it,index) in itemMenu.children" :itemMenu="it" :parentPath="itemMenu.path+'/'" :key="index"></SidebarItem>
        <!-- 内嵌 end -->
      </el-submenu>


      <template v-else>
        <Link v-if="isPathURL(itemMenu.path)" :to="itemMenu.path">
          <el-menu-item :key="itemMenu.name">
            <MzIcon :allName="itemMenu.meta.icon"  />
            <!-- <i :class="itemMenu.meta.icon"></i> -->
            <span slot="title">{{itemMenu.meta.title}}</span>
          </el-menu-item>
        </Link>
        <el-menu-item v-else :index="parentPath+itemMenu.path" :key="itemMenu.name">
          <!-- <i :class="itemMenu.meta.icon"></i> -->
          <MzIcon :allName="itemMenu.meta.icon"  />
          <span slot="title">{{itemMenu.meta.title}}</span>
        </el-menu-item>
      </template>
    <!-- 外层end -->
  </div>
</template>

<script>
  import Link from './Link';
  import {isURL} from 'utils/mz-utils.js'

  export default {
    // 组件名称
    name: 'SidebarItem',
    components: {
      Link
    },
    props: {
      itemMenu: {
        type: Object,
        required: true,
        default: {}
      },
      parentPath: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      };
    },
    methods: {
      isPathURL(routePath) {
        return isURL(routePath)
      },
    },
    computed: {

    },
  };
</script>

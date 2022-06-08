<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/5/9 11:09
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <el-container>
    <el-aside style="
    display: flex;
    flex-direction: column;
" width="">
      <span class="admin-title">{{adminTitle}}</span>
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="54px">
        <ul class="header-left-ul">
          <li>
            <i style="font-size: 23px;" :class=" isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="handleShrink"></i>
          </li>
          <li>
            <i style="font-size: 23px;" :class=" isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="handleShrink"></i>
          </li>
        </ul>
      </el-header>
      <div class="tables-column">11111</div>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import {L2Dwidget} from 'live2d-widget'
  export default {
    // 组件名称
    name: 'Index',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      return {
        isCollapse: false,
        adminTitle: '小政后台管理'
      }
    },
    // 组件方法
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleShrink(){
          this.isCollapse = !this.isCollapse
          if (this.isCollapse){
            this.adminTitle = '小政'
          }else {
            this.adminTitle = '小政后台管理'
          }
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    // 以下是生命周期钩子   注：没用到的钩子请自行删除
    /**
     * 在实例初始化之后，组件属性计算之前，如data属性等
     */
    beforeCreate() {

    },
    /**
     * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
     */
    created() {
      setTimeout(function () {
        L2Dwidget.init({
          model: {
            jsonPath: 'https://cdn.jsdelivr.net/gh/wangsrGit119/wangsr-image-bucket/L2Dwidget/live2d-widget-model-haruto/assets/haruto.model.json',
            scale: 1
          },dialog: {
            enable: true,
            script: {
              'tap body': '哎呀！别碰我！',
              'tap face': '人家是在认真写博客哦--前端妹子',
            }
          },
          mobile: { "show": true, scale: 0.5 },
          display: {
            "superSample": 2,
            "width": 200,
            "height": 400,
            "position": "right",
            "hOffset": 0,
            "vOffset": 0
          }
        });
      },1000);
      setInterval(this.setTime, 1000);
    },
    /**
     * 在挂载开始之前被调用：相关的 render 函数首次被调用。
     */
    beforeMount() {

    },
    /**
     * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
     * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
     */
    mounted() {

    },
    /**
     * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
     * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
     */
    beforeUpdate() {

    },
    /**
     * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
     * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
     */
    updated() {

    },
    /**
     * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
     */
    activated() {

    },
    /**
     * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
     */
    deactivated() {

    },
    /**
     * 实例销毁之前调用。在这一步，实例仍然完全可用。
     */
    beforeDestroy() {

    },
    /**
     * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
     * 所有的事件监听器会被移除，所有的子实例也会被销毁。
     */
    destroyed() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style lang="less" scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    /*text-align: center;*/
    line-height: 54px;
  }

  .header-left-ul{
    display: flex;
  }

  .tables-column{
    height: 35px;
    line-height: 35px;
    background-color: rgb(255, 255, 255);
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /*text-align: center;*/
    /*line-height: 200px;*/
    height: calc(100vh - 0px);
    .admin-title{
      display: block;
      padding: 10px 0;
      margin: auto;
      font-weight: bold;
      font-size: 30px;
      font-family: fangsong;
    }
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
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
  .el-menu{
    height: 100%;
  }
</style>

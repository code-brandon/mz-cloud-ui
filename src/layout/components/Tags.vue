<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/6/23 22:44
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div class="tags" v-if="showTags">
    <ul class="tags-ul">
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
        <router-link :to="item.path" class="tags-li-title" @contextmenu.prevent.native="openMenu(item,$event)">
          {{item.title}}
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshPage(selectedTag)">刷新当前页面</li>
      <li>菜单二</li>
    </ul>
  </div>
</template>

<script>
const  redirect = '/redirect'
  import router from '@/router';
  import bus from './Bus';
  export default {
    // 组件名称
    name: 'Tags',
    data() {
      return {
        tagsList: [],
        visible: false,
        selectedTag: {},
        top: 0,
        left: 0,
      }
    },
    methods: {
      isActive(path) {
        return path === this.$route.fullPath;
      },
      // 关闭单个标签
      closeTags(index) {
        const delItem = this.tagsList.splice(index, 1)[0];
        const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
        if (item) {
          delItem.path === this.$route.fullPath && this.$router.push(item.path);
        }else{
          this.$router.push('/');
        }
        this.setTags(this.$route);
      },
      // 关闭全部标签
      closeAll(){
        this.tagsList = [];
        this.$router.push('/');
        this.setTags(this.$route);
      },
      // 关闭其他标签
      closeOther(){
        const curItem = this.tagsList.filter(item => {
          return item.path === this.$route.fullPath;
        })
        this.tagsList = curItem;
      },
      // 设置标签
      setTags(route){
        const isExist = this.tagsList.some(item => {
          return route.fullPath.replace(redirect,'') == item.path;
        })
        if(!isExist){
          if(this.tagsList.length >= 8){
            this.tagsList.shift();
          }
          this.tagsList.push({
            title: route.meta.title,
            path: route.fullPath,
            name: route.name,
            keepAlive:route.meta.keepAlive
          })
        }
        this.$store.commit("SET_ALL_TAG",this.tagsList)
        bus.$emit('tags', this.tagsList);
      },
      handleTags(command){
        command === 'other' ? this.closeOther() : this.closeAll();
      },
      //右击
      openMenu(tag, e) {
        this.selectedTag = tag
        var x = e.pageX+30; //这个应该是相对于整个浏览器页面的x坐标，左上角为坐标原点（0,0）
        var y = e.pageY; //这个应该是相对于整个浏览器页面的y坐标，左上角为坐标原点（0,0）
        this.top = y;
        this.left = x;
        this.visible = true; //显示菜单
      },
      //关闭菜单
      closeMenu() {
        this.visible = false; //关闭菜单
      },
      // 刷新当前tab页签
      refreshPage(obj) {
        const { path, query, matched } = router.currentRoute;
        if (obj === undefined) {
          matched.forEach((m) => {
            if (m.components && m.components.default && m.components.default.name) {
              if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
                obj = { name: m.components.default.name, path: path, query: query };
              }
            }
          });
        }else{
          obj = { name: obj.name, path: obj.path, query: obj.query };
        }
        router.replace({
          path: redirect + obj.path,
          query: obj.query
        }) 
      },
    },
    computed: {
      showTags() {
        return this.tagsList.length > 0;
      },
      getTabs(){
        return this.$store.getters.tabsList
      }
    },
    watch:{
      $route(newValue, oldValue){
        this.setTags(newValue);
      },
      //   监听属性对象，newValue为新的值，也就是改变后的值
      visible(newValue, oldValue) {
        if (newValue) {
          //菜单显示的时候
          // document.body.addEventListener，document.body.removeEventListener它们都接受3个参数
          // ("事件名" , "事件处理函数" , "布尔值");
          // 在body上添加事件处理程序
          document.body.addEventListener("click", this.closeMenu);
        } else {
          //菜单隐藏的时候
          // 移除body上添加的事件处理程序
          document.body.removeEventListener("click", this.closeMenu);
        }
      },
    },
    created(){
      this.tagsList = this.getTabs;
      this.setTags(this.$route);
    }
  }

</script>


<style lang="less" scoped>
  .tags {
    position: relative;
    height: 30px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    box-shadow: 0 5px 10px #ddd;
  }

  .tags .tags-ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .tags-li {
    float: left;
    margin: 3px 5px 2px 3px;
    border-radius: 3px;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 23px;
    line-height: 23px;
    border: 1px solid #e9eaec;
    // background: #fff;
    padding: 0 5px 0 12px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    transition: all .3s ease-in;
  }

  .tags-li:not(.active):hover {
    background: #f8f8f8;
  }

  .tags-li.active {
    // color: #e33838;
  }

  .tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
  }

  .tags-li.active .tags-li-title {
    color:var( --code);
  }

  .tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
    z-index: 10;
  }

  .contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed; //关键样式设置固定定位
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
 
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}

</style>

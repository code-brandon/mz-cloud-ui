<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/6/23 22:03
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div class="header">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="collapseChage()">
        <i v-if="!collapse" class="el-icon-s-fold"></i>
        <i v-else class="el-icon-s-unfold"></i>
      </div>
      <div class="logo">后台管理系统</div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <el-avatar shape="square" size="small" fit="cover" :src="avatarUrl">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <!--<div class="user-avator">
          <img src="@/assets/logo.png" />
        </div>-->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <a href="https://github.com/code-brandon" target="_blank">
              <el-dropdown-item>项目仓库</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from './Bus';
export default {
  // 组件名称
  name: 'Header',
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: 'XiaoZheng',
      screenWidth: null,
    };
  },
  computed: {
    username() {
      let username = this.$store.getters.user.nickName;
      return username ? username : this.name;
    },
    avatarUrl() {
      return this.$store.getters.user.avatar || require('@/assets/logo.png');
    },
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        this.$store
          .dispatch('LogOut')
          .then(() => {
            this.$router.push('/login');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    widthChage() {
      let n = this.screenWidth;
      if (n < 1500) {
        this.collapseEmit(true);
      } else {
        this.collapseEmit(false);
      }
      if (n <= 768) {
        this.mobileEmit(true);
      } else {
        this.mobileEmit(false);
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    collapseEmit(flg) {
      this.collapse = flg;
      bus.$emit('collapse', this.collapse);
    },
    hideSidebarEmit(val) {
      bus.$emit('hideSidebar', val);
    },
    mobileEmit(val) {
      bus.$emit('mobileSize', val);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
  mounted() {
    //获取屏幕尺寸
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      //屏幕尺寸变化
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  created() {
    bus.$on('collapse', (msg) => {
      this.collapse = msg;
    });
  },
  /**
   * 实例销毁之前调用。在这一步，实例仍然完全可用。
   */
  beforeDestroy() {
    bus.$off();
  },
  watch: {
    screenWidth: function (n, o) {
      this.widthChage();
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  // overflow: hidden;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  font-size: 22px;
  display: flex;
  justify-content: space-between;
  /*color: #fff;*/
  background-color: #d3dce6;
}
.collapse-btn {
  padding: 0 10px;
  cursor: pointer;
}
// .header .logo {
//   width: 250px;
// }
.header-left {
  display: flex;
  align-items: center;
}
.header-right {
  display: flex;
  padding-right: 20px;
}
.header-user-con {
  display: flex;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
  white-space: nowrap;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>

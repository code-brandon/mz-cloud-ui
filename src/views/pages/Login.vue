<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/5/15 21:57
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div class="login_form" :style="bgImageUrl">
    <el-form
            :model="formData"
            status-icon
            :rules="rules"
            ref="form"
            class="login_container">
      <h3 class="login_title">Mz后台系统登录</h3>
      <el-row type="flex">
        <el-col class="hidden-xs-only" :span="12">
          <img style="width: 100%" src="@/assets/images/dttbangong.png"></img>
        </el-col>
        <el-col :xs="24" :span="12" style="    margin: auto 0;">
          <el-row>
            <el-col>
              <el-form-item
                      label="用户账户"
                      label-width="80px"
                      prop="username"
                      class="username"
              >
                <el-input type="input" v-model="formData.username" autocomplete="off" placeholder="请输入账户"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                      label="用户密码"
                      label-width="80px"
                      prop="password">
                <el-input type="password" v-model="formData.password"
                          @keyup.enter.native="Login"
                          show-password
                          autocomplete="off" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                label="登录校验"
                label-width="80px"
                prop="code">
                <el-popover placement="top" width="400" trigger="manual" v-model="captchaShow">
                  <captcha ref="captcha" @result="captchaResult" @close="captchaClose"></captcha>
                  <el-button class="captcha-click" slot="reference" @click="captchaClick">
                    <div>click 验证</div>
                    <transition name="el-fade-in">
                      <div v-show="captchaOk" class="transition-box">
                        <i class="el-icon-success"></i>
                      </div>
                    </transition>
                  </el-button>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col>
              <div class="login_submit_div">
                <el-button type="primary" @click.native.prevent="Login" class="login_submit">登录</el-button>
                <el-button type="primary" @click="resetForm"  class="login_submit">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div class="login-footer"></div>
  </div>
</template>

<script>
import captcha from '@/components/common/Captcha.vue'
import {bingBg} from '@/api/common/thirdPartApi'

export default {
    // 组件名称
    name: 'Login',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {captcha},
    // 组件状态值
    data() {
      return {
        captchaShow: false,
        captchaOk: false,
        imageUrl:'',
        formData: {
          username:"test",
          password:"123456",
          code: '',
        },
        // 校验
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              message: '用户名长度不能小于3为',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              message: '密码长度不能小于3为',
              trigger: 'blur'
            }
          ],
          code: [
            {
              required: true,
              message: '请校验验证码',
              trigger: 'blur',
            },
          ],
        }
      }
    },
    // 组件方法
    methods: {
      captchaClick() {
        this.captchaShow = true
        this.$nextTick(() => {
          this.$refs.captcha.init()
        })
      },
      captchaClose(val) {
        this.captchaShow = false
      },
      captchaResult(val) {
        if (val && val.data.flg) {
          this.captchaShow = false
          this.captchaOk = true
          this.formData.code = val.data.code
          this.$message.success('验证成功')
        } else {
          this.captchaShow = true
          this.captchaOk = false
          this.$message.warning('验证失败')
        }
      },
      Login(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch('Login',this.formData).then((res)=>{
              if (res.code === this.$OkCode) {
                this.$router.push({path: "/"});
              }
            }).catch(error=>{
              console.log(error)
            })
          } else {
            return false;
          }
        });
      },
      bingBg(){
        bingBg().then(({data:res}) => {
          let images = res.MediaContents;
          this.imageUrl = images[0].ImageContent.Image.Url;
        }).catch(error => {
          console.log(error)
        })
      },
      resetForm() {
        this.$refs.form.resetFields();
      }
    },
    // 计算属性
    computed: {
      bgImageUrl(){
        let url = this.imageUrl;
        if (!url) return `--bgImageUrl:url(${url})`
        url = url.substr(0, url.indexOf('&'));
        url = "/biying"+url.substring(0, url.lastIndexOf('_')) + '_UHD.jpg';
        return `--bgImageUrl:url(${url})`
      }
    },
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
      this.bingBg()
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
<style lang="less" >

  .login_form{
    // min-width: 550px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: var(--bgImageUrl);
    background-size: cover;
  }

  .login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login_container {
    border-radius: 15px;
    background-clip: padding-box;
    width: 750px;
    padding: 40px;
    background-color: #ffffffe0;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;
  }
  .el-input__inner{
    background-color: #ffffff2b !important;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .el-button.login_submit {
    width: 35%;
  }

  .captcha-click {
    width: 100%;

    span {
      display: flex;
      justify-content: space-between;
    }

    .transition-box {
      color: #42b983;
    }
  }

  .login_submit_div {
    margin: 10px auto 0px auto;
    display: flex;
    justify-content: center;
  }
  /*取消 页面长度而出现的滚动条*/
  body,html,#app{
    height: 0 !important;
  }
</style>

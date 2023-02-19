<!--
  功能：岗位添加或更新页面
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2023年01月07日 19:30:23
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>

  <el-dialog :title="!dataForm.postId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="参数名称" prop="configName">
            <el-input v-model="dataForm.configName" placeholder="参数名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="参数键名" prop="configKey">
            <el-input v-model="dataForm.configKey" placeholder="参数键名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="参数键值" prop="configValue">
            <el-input v-model="dataForm.configValue" placeholder="参数键值"></el-input>
          </el-form-item>
        </el-col>
      
        <el-col :sm="24" :md="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { getConfigInfo,updateConfig,saveConfig } from '@/api/system/config'
export default {
  // 组件名称
  name: 'post-add-or-update',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      visible: false,
      dataForm: {
        configId: '',
        configName: '',
        configKey: '',
        configValue: '',
        remark: ''
      },
      dataRule: {
        configName: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: '参数键名不能为空', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: '参数键值不能为空', trigger: 'blur' }
        ],
        /*
         remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ] */
      }
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    init(configId) {
      this.dataForm.configId = configId
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.configId) {
          getConfigInfo(this.dataForm.configId).then(({ data: res }) => {
            if (res.code === this.$OkCode) {
              this.dataForm = res.data
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.postId) {
            saveConfig({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          } else {
            updateConfig({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          }
        }
      })
    }
  },
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
<style scoped>

</style>

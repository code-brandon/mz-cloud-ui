<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/10/10 22:19
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <el-dialog
          width="680px"
          :title="!dataForm.deptId ? '新增' : '修改'"
          :close-on-click-modal="false"
          :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">

      <el-row>
        <el-col :span="24">
          <el-form-item label="父部门id" prop="parentId">
            <Treeselect v-model="dataForm.parentId"
                        :show-count="true"
                        :options="options"
                        placeholder="请选择部门"
                        @input="changeDeptChannel"
                        :normalizer="normalizer">
            </Treeselect>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input v-model="dataForm.orderNum" placeholder="显示顺序"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="dataForm.leader" placeholder="负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
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
  import { getDeptTree} from '@/api/system/dept.js';
  import { getUserInfo} from '@/api/system/user.js';
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    // 组件名称
    name: 'dept-add-or-update',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {Treeselect},
    // 组件状态值
    data() {
      return {
        visible: false,
        dataForm: {
          deptId: undefined,
          parentId: undefined,
          ancestors: '',
          deptName: '',
          orderNum: 0,
          leader: '',
          phone: '',
          email: '',
          status: '0',
          delFlag: '',
          createBy: '',
          createTime: '',
          updateBy: '',
          updateTime: ''
        },
        options:[],
        /** 转换菜单数据结构 */
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.id,
            label: node.name,
            children: node.children
          };
        },
        dataRule: {
          parentId: [
            { required: true, message: '父部门id不能为空', trigger: 'blur' }
          ],
          ancestors: [
            { required: true, message: '祖级列表不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '显示顺序不能为空', trigger: 'blur' }
          ],
          leader: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '部门状态（0正常 1停用）不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    // 组件方法
    methods: {
      init (deptId) {
        this.dataForm.deptId = deptId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          if (this.dataForm.deptId) {
            getUserInfo(deptId).then(({data:res})=>{
              this.dataForm = res.data;
            }).catch(error=>{
              console.log(error)
            })
          }
        })
      },
      getDeptTree(){
        getDeptTree().then(({data:res}) => {
          this.options = res.data;
        }).catch(error => {
          console.log(error)
        })
      },
      changeDeptChannel(){
        this.$refs.dataForm.validateField('deptId')
      },
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
      this.getDeptTree();
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

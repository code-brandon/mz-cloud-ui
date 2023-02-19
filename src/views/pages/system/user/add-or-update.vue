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
  <el-dialog width="680px" :title="!dataForm.deptId ? '新增' : '编辑'" :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="dataForm.nickName" placeholder="用户昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <Treeselect v-model="dataForm.deptId" :show-count="true" :options="deptTrees" placeholder="请选择部门"
              @input="changeDeptChannel" :normalizer="normalizer">
            </Treeselect>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="dataForm.phonenumber" placeholder="手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="用户邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="dataForm.username" placeholder="用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="dataForm.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-radio-group v-model="dataForm.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帐号状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位" prop="deptIds">
            <el-select v-model="dataForm.postIds" multiple placeholder="请选择岗位">
              <el-option v-for="item in postLists" :key="item.postId" :label="item.postName" :value="item.postId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="dataForm.roleIds" multiple placeholder="请选择角色">
              <el-option v-for="item in roleLists" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="头像地址" prop="avatar">
            <el-input v-model="dataForm.avatar" placeholder="头像地址"></el-input>
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
import { getDeptTree } from '@/api/system/dept.js';
import { getUserInfo,saveUser,updateUser } from '@/api/system/user';
import { getRoleList } from '@/api/system/role';
import {getPostList} from '@/api/system/post'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  // 组件名称
  name: 'user-add-or-update',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: { Treeselect },
  // 组件状态值
  data() {
    return {
      visible: false,
      dataForm: {
        userId: undefined,
        deptId: undefined,
        postIds: undefined,
        roleIds: undefined,
        username: '',
        nickName: '',
        userType: '',
        email: '',
        phonenumber: '',
        sex: '0',
        avatar: '',
        password: '123456',
        status: '0',
        delFlag: '',
        loginIp: '',
        loginDate: '',
        remark: ''
      },
      deptTrees: [],
      postLists: [],
      roleLists: [],
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
        deptId: [
          { required: true, message: '部门ID不能为空', trigger: ['input'] }
        ],
        username: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '用户邮箱不能为空', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '用户性别（0男 1女 2未知）不能为空', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '头像地址不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '帐号状态（0正常 1停用）不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 组件方法
  methods: {
    init(userId) {
      this.dataForm.userId = userId
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.dataForm.userId) {
          getUserInfo(userId).then(({ data: res }) => {
            this.dataForm = res.data;
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    dataFormSubmit(){
      if (this.dataForm.userId) {
        updateUser(this.dataForm).then(({ data: res }) => {
          console.log(res);
          if(res.code == this.$OkCode){
            this.visible = false
          }
        }).catch(error => {
          console.log(error)
        })
      }else{
        saveUser(this.dataForm).then(({ data: res }) => {
          console.log(res);
          if(res.code == this.$OkCode){
            this.visible = false
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getDeptTree() {
      getDeptTree().then(({ data: res }) => {
        this.deptTrees = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
    getPostList() {
      getPostList().then(({ data: res }) => {
        this.postLists = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
    getRoleList() {
      getRoleList().then(({ data: res }) => {
        this.roleLists = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
    changeDeptChannel() {
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
    this.getPostList();
    this.getRoleList();
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

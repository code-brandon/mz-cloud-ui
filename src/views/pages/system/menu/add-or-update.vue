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
  <el-dialog width="680px" :title="!dataForm.menuId ? '新增' : '修改'" :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">

      <el-form-item label="父菜单ID" prop="parentId">
        <Treeselect v-model="dataForm.parentId" :show-count="true" :options="options" :normalizer="normalizer">

        </Treeselect>

      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="dataForm.menuType">
          <el-radio label="M">目录</el-radio>
          <el-radio label="C">菜单</el-radio>
          <el-radio label="F">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="dataForm.menuName" placeholder="菜单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">

        <el-col :span="12" v-if="dataForm.menuType !=='M'">
          <el-form-item label="权限标识" prop="perms">
            <el-input v-model="dataForm.perms" placeholder="权限标识"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="dataForm.menuType !=='F'">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="dataForm.icon" placeholder="菜单图标"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="dataForm.menuType !=='F'">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="dataForm.path" placeholder="路由地址"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="dataForm.menuType ==='C'">
          <el-form-item label="组件地址" prop="component">
            <el-input v-model="dataForm.component" placeholder="组件地址"></el-input>
          </el-form-item>
        </el-col>

        <!--        <el-col :span="12" v-if="dataForm.menuType ==='C'">
                  <el-form-item label="路由参数">
                    <el-input v-model="dataForm.query" placeholder="路由参数"></el-input>
                  </el-form-item>
                </el-col>-->

        <el-col :span="12" v-if="dataForm.menuType !=='F'">
          <el-form-item label="是否外链" prop="isFrame">
            <el-radio-group v-model="dataForm.isFrame">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.menuType !=='F'">
          <el-form-item label="显示状态" prop="visible">
            <el-radio-group v-model="dataForm.visible">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.menuType !=='F'">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-else>
          <el-form-item label="按钮状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.menuType ==='C'">
          <el-form-item label="是否缓存" prop="isCache">
            <el-radio-group v-model="dataForm.isCache">
              <el-radio :label="0">缓存</el-radio>
              <el-radio :label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>


        <el-col :span="22">
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
import {getMenuTree, getMenuInfo, updateMenu, saveMenu} from '@/api/system/menu.js';
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  // 组件名称
  name: 'menu-add-or-update',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {Treeselect},
  // 组件状态值
  data() {
    return {
      visible: false,
      dataForm: {
        orderNum: 0,
        isFrame: 1,
        isCache: 0,
        visible: "0",
        menuType: "M",
        parentId: 0,
        status: "0",
        menuName: '',
        path:'',
        component: '',
        query:'',
        perms:'',
        icon:'',
        remark:''
      },
      options: [
        {
          id: "0",
          name: "顶级目录",
          children: [],
        }
      ],
      /** 转换菜单数据结构 */
      normalizer(node) {
        // if (node.children && !node.children.length) {
        //   delete node.children;
        // }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      dataRule: {
        menuName: [
          {required: true, message: '菜单名称不能为空', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '父菜单ID不能为空', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: '显示顺序不能为空', trigger: 'blur'}
        ],
        /*path: [
          {required: true, message: '路由地址不能为空', trigger: 'blur'}
        ],
        component: [
          {required: true, message: '组件地址不能为空', trigger: 'blur'}
        ],*/
        isFrame: [
          {required: true, message: '是否为外链（0是 1否）不能为空', trigger: 'blur'}
        ],
        isCache: [
          {required: true, message: '是否缓存（0缓存 1不缓存）不能为空', trigger: 'blur'}
        ],
        menuType: [
          {required: true, message: '菜单类型（M目录 C菜单 F按钮）不能为空', trigger: 'blur'}
        ],
        visible: [
          {required: true, message: '菜单状态（0显示 1隐藏）不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '菜单状态（0正常 1停用）不能为空', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '菜单图标不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  // 组件方法
  methods: {
    init(data) {
      if (data.type === 2) {
        this.dataForm.parentId = data.menuId;
      } else {
        this.dataForm.menuId = data.menuId;
      }

      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        if (this.dataForm.menuId) {
          getMenuInfo(data.menuId).then(({data: res}) => {
            this.dataForm = res.data;
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    getMenuTree() {
      getMenuTree().then(({data: res}) => {
        this.options[0]["children"] = res.data;
      }).catch(err => {
        console.log(err)
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.menuId) {
            console.log(this.dataForm)
            saveMenu({...this.dataForm}).then(({data:res}) => {
              if (res && res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            updateMenu({...this.dataForm}).then(({data:res}) => {
              if (res && res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }
        }
      })
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
    this.getMenuTree();
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

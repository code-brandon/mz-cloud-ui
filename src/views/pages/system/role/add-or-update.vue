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
  <el-dialog width="680px" :title="pageTitle" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input :disabled="isDptIds" v-model="dataForm.roleName" placeholder="角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限字符" prop="roleKey">
            <el-input :disabled="isDptIds" v-model="dataForm.roleKey" placeholder="角色权限字符串"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="!isDptIds">
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input-number v-model="dataForm.roleSort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">

          <el-form-item v-if="isDptIds" label="数据范围" prop="dataScope">
            <el-select v-model="dataForm.dataScope" placeholder="">
              <el-option v-for="(i) of 10" :value="i" :key="i">{{ i }}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="isDptIds" label="数据范围" prop="deptIds">
            <el-checkbox @change="isFold">展开/折叠</el-checkbox>
            <el-checkbox @change="isSelect">全选/全不选</el-checkbox>
            <el-checkbox v-model="dataForm.deptCheckStrictly" :true-label="1" :checked="dataForm.deptCheckStrictly > 0"
              :false-label="0">父子联动</el-checkbox>
            <el-tree :data="deptsDataTree" :default-expand-all="false" show-checkbox
              :expand-on-click-node="false" node-key="id" ref="deptTree" highlight-current :props="defaultProps"
              :check-strictly="dataForm.deptCheckStrictly == 0" >
            </el-tree>
          </el-form-item>

          <el-form-item v-else label="菜单权限" prop="menuIds">
            <el-checkbox @change="isFold">展开/折叠</el-checkbox>
            <el-checkbox @change="isSelect">全选/全不选</el-checkbox>
            <el-checkbox v-model="dataForm.menuCheckStrictly" :true-label="1" :checked="dataForm.menuCheckStrictly > 0"
              :false-label="0">父子联动</el-checkbox>
            <el-tree :data="menusDataTree" :default-expand-all="false" show-checkbox
              :expand-on-click-node="false" node-key="id" ref="menuTree" highlight-current :props="defaultProps"
              :check-strictly="dataForm.menuCheckStrictly == 0" >
            </el-tree>
          </el-form-item>

        </el-col>
        <el-col :span="24" v-if="!isDptIds">
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
import { getMenuTree } from '@/api/system/menu';
import { getDeptTree } from '@/api/system/dept';
import { getRoleInfo, saveRoleMenu, updateRoleMenu, saveRoleDept, listRoleDept } from '@/api/system/role';

export default {
  // 组件名称
  name: 'role-add-or-update',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      visible: false,
      // 重新渲染表格状态
      refreshTree: true,
      pageType: null,
      menusDataTree: [],
      deptsDataTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dataForm: {
        roleId: undefined,
        roleName: '',
        roleKey: '',
        roleSort: '',
        menuIds: [],
        deptIds: [],
        dataScope: '',
        menuCheckStrictly: '0',
        deptCheckStrictly: '0',
        status: '0',
        delFlag: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        remark: ''
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '角色权限字符串不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '显示顺序不能为空', trigger: 'blur' }
        ],
        dataScope: [
          { required: true, message: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）不能为空', trigger: 'blur' }
        ],
        menuCheckStrictly: [
          { required: true, message: '菜单树选择项是否关联显示不能为空', trigger: 'blur' }
        ],
        deptCheckStrictly: [
          { required: true, message: '部门树选择项是否关联显示不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '角色状态（0正常 1停用）不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '删除标志（0代表存在 2代表删除）不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 组件方法
  methods: {
    init(data) {
      this.visible = true
      this.pageType = data.type
      this.$nextTick(() => {
        this.initData()
        if (this.pageType == 1) {
          this.dataForm.roleId = data.roleId
          getRoleInfo(data.roleId).then(({ data: res }) => {
            this.dataForm = res.data;
            this.$refs.menuTree.setCheckedKeys(this.dataForm.menuIds);
          }).catch(error => {
            console.error(error)
          })
        }
        if (this.pageType == 2) {

          this.dataForm = { ...this.dataForm, ...data.row }
          getDeptTree().then(({ data: res }) => {
            this.deptsDataTree = res.data;
            listRoleDept(data.roleId).then(({ data: res }) => {
              if (res.code == this.$OkCode) {
                let deptIds = []
                res.data.forEach(item => {
                  deptIds.push(item.deptId)
                })
                this.dataForm.deptIds = deptIds
                console.log(this.$refs.deptTree.store);
                this.$refs.deptTree.setCheckedKeys(deptIds);
              }

            }).catch(error => {
              console.error(error);
            })
          }).catch(error => {
            console.error(error);
          })
        }
      })
    },
    isFold(val) {
      if (this.$refs.deptTree){
        for (let index = 0; index < this.deptsDataTree.length; index++) {
          this.$refs.deptTree.store.nodesMap[this.deptsDataTree[index].id].expanded = val;
        }
      }
      if (this.$refs.menuTree) {
        for (let index = 0; index < this.menusDataTree.length; index++) {
          this.$refs.menuTree.store.nodesMap[this.menusDataTree[index].id].expanded = val;
        }
      }
    },
    isSelect(val) {
      if (this.$refs.deptTree){
        this.$refs.deptTree.setCheckedNodes(val ? this.deptsDataTree: []);
        
      }
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedNodes(val ? this.menusDataTree: []);
      }
    },
    getMenuTree() {
      getMenuTree().then(({ data: res }) => {
        this.menusDataTree = res.data;
      })
    },
    dataFormSubmit() {
      if (this.pageType == 0) {
        saveRoleMenu(this.dataForm).then(({ data: res }) => {
          if (res.code == this.$OkCode) {
            this.visible = false
            this.$emit('refreshDataList')
          }
        }).catch(error => {
          console.error(error)
        })
      }
      if (this.pageType == 1) {
        this.dataForm.menuIds = this.getCheckedNodes
        updateRoleMenu(this.dataForm).then(({ data: res }) => {
          if (res.code == this.$OkCode) {
            this.visible = false
            this.$emit('refreshDataList')
          }
        }).catch(error => {
          console.error(error)
        })
      }
      if (this.pageType == 2) {

        let tempParam = { roleId: this.dataForm.roleId, deptCheckStrictly: this.dataForm.deptCheckStrictly, dataScope: this.dataForm.dataScope, deptIds: this.getCheckedNodes }
        saveRoleDept(tempParam).then(({ data: res }) => {
          if (res.code == this.$OkCode) {
            this.visible = false
          }

        }).catch(error => {
          console.error(error);
        })
      }
    },
    initData() {
      this.dataForm = {
        roleId: undefined,
        roleName: '',
        roleKey: '',
        roleSort: '',
        menuIds: [],
        deptIds: [],
        dataScope: '',
        menuCheckStrictly: '0',
        deptCheckStrictly: '0',
        status: '0',
        delFlag: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        remark: ''
      }
      if (this.$refs.menuTree) this.$refs.menuTree.setCheckedKeys([]);
      if (this.$refs.deptTree) this.$refs.deptTree.setCheckedKeys([]);
    }
  },
  // 计算属性
  computed: {
    isDptIds() {
      return this.pageType == 2
    },
    isDisabled() {
      return this.pageType == 2
    },
    pageTitle() {
      switch (this.pageType) {
        case 0:
          return '新增'
        case 1:
          return '编辑'
        case 2:
          return '数据权限'
        default:
          return ''
      }
    },
    getCheckedNodes() {
      let treeIds = []
      let checkedKeys = []
      if (this.$refs.menuTree) checkedKeys = this.$refs.menuTree.getCheckedNodes();
      if (this.$refs.deptTree) checkedKeys = this.$refs.deptTree.getCheckedNodes();
      if (!checkedKeys) return []
      checkedKeys.forEach(item => {
        treeIds.push(item.id)
      });
      return treeIds;
    },
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

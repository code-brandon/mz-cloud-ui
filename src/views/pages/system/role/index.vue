<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/10/9 18:42
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div>
    <el-form :inline="true" size="small" :model="param.data" ref="formInline" class="demo-form-inline" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="param.data.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色权限" prop="roleKey">
        <el-input v-model="param.data.roleKey" placeholder="角色权限"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-select v-model="param.data.status" placeholder="请选择状态">
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <CommonSearchReset @reset="onReset" @search="getRolePage"></CommonSearchReset>
      </el-form-item>
    </el-form>

    <CommonControlCard @refresh="getRolePage">
      <template>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle({type:0})">
          新增
        </el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="deleteRole()">
          删除
        </el-button>
        <el-button type="info" plain icon="el-icon-upload2" size="mini">
          导入
        </el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini">
          导出
        </el-button>
      </template>
    </CommonControlCard>
    <el-table :data="tableData.list" border style="width: 100%;" @selection-change="selectionChangeHandle" v-loading="loading">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="roleId" header-align="center" align="center" label="角色ID">
      </el-table-column>
      <el-table-column prop="roleName" header-align="center" align="center" label="角色名称">
      </el-table-column>
      <el-table-column prop="roleKey" header-align="center" align="center" label="角色权限">
      </el-table-column>
      <el-table-column prop="roleSort" header-align="center" align="center" sortable label="顺序">
      </el-table-column>
      <el-table-column prop="dataScope" header-align="center" align="center" label="数据范围">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="角色状态">
        <template v-slot="scope">
          <el-tooltip :content="'Switch value: ' + scope.row.status" placement="top">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="0"
              inactive-value="1" @change="updateRoleStatus({sysId:scope.row.roleId,status:scope.row.status})">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" header-align="center" align="center" label="创建者">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
      </el-table-column>
      <el-table-column prop="updateBy" header-align="center" align="center" label="更新者">
      </el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" width="180" label="更新时间">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" header-align="center" align="center" label="备注">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle({roleId:scope.row.roleId,type:1})">编辑</el-button>
          <el-button style="margin-left: 10px" type="text" slot="reference" icon="el-icon-delete" size="small" @click="deleteRole(scope.row)">删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link" style="font-size: 12px">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check">数据权限</el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user">分配用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination
        :currPage.sync="tableData.currPage"
        :pageSize.sync="tableData.pageSize"
        :totalCount.sync="tableData.totalCount"
        :page="param.page"
        @pageReset="getRolePage">
    </CommonPagination>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getRolePage"></AddOrUpdate>
    <RoleUser v-if="roleUserVisible" ref="roleUser" @refreshDataList="getRolePage"></RoleUser>
  </div>
</template>

<script>
import { getRolePage,deleteRole,updateRoleStatus } from '@/api/system/role.js';
import AddOrUpdate from './add-or-update'
import RoleUser from './role-user.vue'
import CommonControlCard from '@/components/common/CommonControlCard';
import CommonSearchReset from '@/components/common/CommonSearchReset';
import CommonPagination from '@/components/common/CommonPagination';
export default {
  // 组件名称
  name: 'Role',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: { AddOrUpdate, CommonControlCard, CommonSearchReset,CommonPagination,RoleUser },
  // 组件状态值
  data() {
    return {
      addOrUpdateVisible: false,
      roleUserVisible: false,
      param: {
        page: {
          page: 1,
          limit: 10
        },
        data:{
          roleName:'',
          roleKey:'',
          status:'',
        }
      },
      loading: true,
      tableData: {},
      dataListSelections:[],
    }
  },
  // 组件方法
  methods: {
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init({type:2,roleId:row.roleId,row})
      })
    },
    /** 分配用户操作 */
    handleAuthUser(row) {
      console.log(row)
      this.roleUserVisible = true
      this.$nextTick(() => {
        this.$refs.roleUser.init({type:3,roleId:row.roleId,row})
      })
    },
    addOrUpdateHandle(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    onReset() {
      this.$nextTick(() => {
        this.$refs.formInline.resetFields();
      })
    },
    getRolePage() {
      this.loading = true
      getRolePage(this.param).then(({ data: res }) => {
        this.tableData = res.data
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    updateRoleStatus(val){
      updateRoleStatus(val).then(({ data: res }) => {
        if (res.code === this.$OkCode) {
          this.getRolePage()
        }
      }).catch(error => {
        console.error(error)
      })
    },
    deleteRole(val) {
      var ids = val ? [val.roleId] : this.dataListSelections.map(item => {
        return item.roleId
      })
      if(ids.length == 0){
        this.$message.error("请选择要删除的数据")
        return
      }
      this.$confirm(`${val ? `确定对[${val.roleName}]进行删除操作` : `确定对[id=${ids.join(',')}]进行批量删除`}操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(ids).then(({ data: res }) => {
          if (res && res.code === this.$OkCode) {
            this.getRolePage()
          }
        }).catch(error => {
          console.error(error)
        })
      }).catch(()=>{
        this.$message.info(`取消${val ? `删除[${val.roleName}]` : '批量删除'}`);
      })
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
    this.getRolePage()
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

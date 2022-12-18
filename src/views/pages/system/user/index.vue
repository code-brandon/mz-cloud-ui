<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/5/11 22:06
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div>
    <el-row>
      <el-col class="hidden-xs-only" :xs="24" :md="6" :lg="3" :xl="3">
        <el-tree :data="deptData" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"
          node-key="id" ref="tree" highlight-current :props="defaultProps">
        </el-tree>
      </el-col>
      <el-col :xs="24" :md="18" :lg="21" :xl="21">

        <el-form :inline="true" size="small" ref="formInline" :model="param.formInline" class="demo-form-inline">
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="param.formInline.username" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="param.formInline.phonenumber" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="param.formInline.status" placeholder="用户状态">
              <el-option label="正常" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <CommonSearchReset @reset="onReset" @search="onSearch"></CommonSearchReset>
          </el-form-item>
        </el-form>

        <CommonControlCard @refresh="getUserPage">
          <template>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">
              新增
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini">
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

        <el-table :data="tableData.list" border>
          <el-table-column header-align="center" align="center" type="index" width="50">
          </el-table-column>
          <el-table-column header-align="center" align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="nickName" label="昵称" min-width="100">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="username" label="账号" min-width="100">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="sexStr" label="性别">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="email" label="邮箱" width="200">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="deptId" label="部门">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="头像">
            <template v-slot="scope">
              <div class="block">
                <el-avatar shape="square" :size="40" :src="scope.row.avatar">
                  <img src="@/assets/images/ku.png" />
                </el-avatar>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="roleName" label="类型">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="状态">
            <template v-slot="scope">
              <el-tooltip :content="'Switch value: ' + scope.row.status" placement="top">
                <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="0"
                  inactive-value="1">
                </el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" fixed="right" label="操作" width="280">
            <template v-slot="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.userId)">编辑
              </el-button>
              <el-popover popper-class="mz-popover" placement="top" width="110" trigger="hover">
                <p>确定删除吗？</p>
                <div style="text-align: center; margin: 0">
                  <el-button type="danger" round size="mini">确定</el-button>
                </div>
                <el-button style="margin: 0 10px" type="text" slot="reference" icon="el-icon-delete" size="small">删除
                </el-button>
              </el-popover>
              <el-button type="text" icon="el-icon-edit" size="small" @click="resetPasswd(scope.row)">重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <CommonPagination :currPage.sync="tableData.currPage" 
        :pageSize.sync="tableData.pageSize" 
        :totalCount.sync="tableData.totalCount" 
        :page="param.page" 
        @pageReset="changePageReset"></CommonPagination>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getUserPage"></AddOrUpdate>

  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import { getUserPage } from '@/api/system/user.js';
import { getDeptTree } from '@/api/system/dept.js';
import AddOrUpdate from './add-or-update'
import CommonControlCard from '@/components/common/CommonControlCard';
import CommonSearchReset from '@/components/common/CommonSearchReset';
import CommonPagination from '@/components/common/CommonPagination';
export default {
  // 组件名称
  name: 'User',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: { CommonControlCard, CommonSearchReset,CommonPagination, AddOrUpdate },
  // 组件状态值
  data() {
    return {
      param: {
        page: {
          page: 1,
          limit: 10
        },
        formInline: {
          deptId: null
        },
      },
      tableData: {},
      addOrUpdateVisible: false,
      deptData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  // 组件方法
  methods: {
    changePageReset(val){
      this.getUserPage()
    },
    handleNodeClick(val, node, tree) {
      console.log(val, node, tree)
      console.log(`节点数据: ${val.id}`);
      this.param.formInline.deptId = val.id;
      this.param.page = {
        page: 1,
        limit: this.param.page.limit
      };
      this.getUserPage()
    },
    onSearch() {
      this.getUserPage()
    },
    onReset() {
      this.$nextTick(() => {
        this.param.formInline.deptId = null;
        this.$refs.formInline.resetFields();
      })
    },
    // 重置密码
    resetPasswd(val) {
      this.$prompt(`请输入${val.username}的新密码`,`重置用户密码` , {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '密码长度必须为5-20位'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的密码是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    getUserPage() {
      getUserPage(this.param).then(({ data: res }) => {
        console.log(res)
        this.tableData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    getDeptTree() {
      getDeptTree().then(({ data: res }) => {
        console.log(res)
        this.deptData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(userId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(userId)
      })
    },
    init() {
      this.getUserPage()
      this.getDeptTree()
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
    this.init();
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
<style scoped lang="less">
.el-tree {
  background-color: revert !important;
}

.demo-form-inline {
  margin: 10px;
}
</style>

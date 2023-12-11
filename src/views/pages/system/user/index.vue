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
        <el-tree :data="deptData" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" node-key="deptId" ref="tree" highlight-current :props="defaultProps"> </el-tree>
      </el-col>
      <el-col :xs="24" :md="18" :lg="21" :xl="21">
        <el-form :inline="true" size="small" ref="formInline" :model="param.data" class="demo-form-inline">
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="param.data.username" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="param.data.phonenumber" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="param.data.status" placeholder="用户状态">
              <el-option v-for="dict in dict.sys_normal_disable" :key="dict.dictCode" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <CommonSearchReset @reset="onReset" @search="getUserPage"></CommonSearchReset>
          </el-form-item>
        </el-form>

        <CommonControlCard @refresh="getUserPage">
          <template>
            <el-button v-if="$isAuth('system:user:save')" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">
              新增
            </el-button>
            <el-button v-if="$isAuth('system:user:remove')" type="danger" plain icon="el-icon-delete" size="mini" @click="deleteUser()">
              批量删除
            </el-button>
            <el-button v-if="$isAuth('system:user:import')" type="info" plain icon="el-icon-upload2" size="mini">
              导入
            </el-button>
            <el-button v-if="$isAuth('system:user:export')" type="warning" plain icon="el-icon-download" size="mini">
              导出
            </el-button>
          </template>
        </CommonControlCard>

        <el-table :data="tableData.list" border @selection-change="selectionChangeHandle" v-loading="loading">
          <el-table-column header-align="center" align="center" type="index" width="50"> </el-table-column>
          <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="nickName" label="昵称" min-width="100"> </el-table-column>
          <el-table-column header-align="center" align="center" prop="username" label="账号" min-width="100"> </el-table-column>
          <el-table-column header-align="center" align="center" prop="sex" label="性别">
            <template v-slot="scope">
              {{ dict.label.sys_user_sex ? (dict.label.sys_user_sex[scope.row.sex] ? dict.label.sys_user_sex[scope.row.sex] : '未知') : '未知' }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="email" label="邮箱" width="200"> </el-table-column>
          <el-table-column header-align="center" align="center" prop="deptName" label="部门"> </el-table-column>
          <el-table-column header-align="center" align="center" label="头像">
            <template v-slot="scope">
              <div class="block">
                <el-avatar shape="square" :size="40" :src="scope.row.avatar">
                  <img src="@/assets/images/ku.png" />
                </el-avatar>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="userType" label="类型">
            <template v-slot="scope">
              {{ dict.label.sys_user_type ? (dict.label.sys_user_type[scope.row.userType] ? dict.label.sys_user_type[scope.row.userType] : '--') : '--' }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="状态">
            <template v-slot="scope">
              <el-tooltip :content="'Switch value: ' + scope.row.status" placement="top">
                <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1" @change="updateUserStatus({ sysId: scope.row.userId, status: scope.row.status })"> </el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="phonenumber" label="手机号" min-width="150"> </el-table-column>
          <el-table-column header-align="center" align="center" fixed="right" label="操作" width="280">
            <template v-slot="scope">
              <el-button v-if="$isAuth('system:user:edit')" type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
              <el-button v-if="$isAuth('system:user:remove')" type="text" slot="reference" icon="el-icon-delete" size="small" @click="deleteUser(scope.row)">删除</el-button>
              <el-button v-if="$isAuth('system:user:resetpwd')" type="text" icon="el-icon-edit" size="small" @click="resetPasswd(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <CommonPagination :currPage.sync="tableData.currPage" :pageSize.sync="tableData.pageSize" :totalCount.sync="tableData.totalCount" :page="param.page" @pageReset="getUserPage"></CommonPagination>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getUserPage"></AddOrUpdate>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import { getUserPage, resetPasswd, deleteUser, updateUserStatus } from '@/api/system/user.js';
import { getDeptTree } from '@/api/system/dept.js';
import AddOrUpdate from './add-or-update';
import CommonControlCard from '@/components/common/CommonControlCard';
import CommonSearchReset from '@/components/common/CommonSearchReset';
import CommonPagination from '@/components/common/CommonPagination';
export default {
  // 组件名称
  name: 'User',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: { CommonControlCard, CommonSearchReset, CommonPagination, AddOrUpdate },
  dicts: ['sys_user_sex', 'sys_normal_disable', 'sys_user_type'],
  // 组件状态值
  data() {
    return {
      param: {
        page: {
          page: 1,
          limit: 10,
        },
        data: {
          deptId: null,
          username: '',
          phonenumber: '',
          status: '',
        },
      },
      loading: true,
      tableData: {},
      addOrUpdateVisible: false,
      deptData: [],
      dataListSelections: [],
      defaultProps: {
        children: 'children',
        label: 'deptName',
      },
    };
  },
  // 组件方法
  methods: {
    handleNodeClick(val, node, tree) {
      this.param.data.deptId = val.deptId;
      this.param.page = {
        page: 1,
        limit: this.param.page.limit,
      };
      this.getUserPage();
    },
    onReset() {
      this.$nextTick(() => {
        this.param.data.deptId = null;
        this.$refs.formInline.resetFields();
      });
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 重置密码
    resetPasswd(val) {
      this.$prompt(`请输入${val.username}的新密码`, `重置用户密码`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '密码长度必须为5-20位',
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: `${val.username}的密码是: ${value}`,
          });
          resetPasswd({ userId: val.userId, password: value }).catch((error) => {
            console.debug(error);
          });
        })
        .catch(() => {
          this.$message.info(`取消输入重置[${val.username}]密码`);
        });
    },
    getUserPage() {
      this.loading = true;
      getUserPage(this.param)
        .then(({ data: res }) => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch((error) => {
          console.debug(error);
        });
    },
    getDeptTree() {
      getDeptTree()
        .then(({ data: res }) => {
          this.deptData = res.data;
        })
        .catch((error) => {
          console.debug(error);
        });
    },
    addOrUpdateHandle(userId) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(userId);
      });
    },
    updateUserStatus(val) {
      updateUserStatus(val)
        .then(({ data: res }) => {
          if (res.code === this.$OkCode) {
            this.getUserPage();
          }
        })
        .catch((error) => {
          console.debug(error);
        });
    },
    deleteUser(val) {
      var ids = val
        ? [val.userId]
        : this.dataListSelections.map((item) => {
            return item.userId;
          });
      if (ids.length == 0) {
        this.$message.error('请选择要删除的数据');
        return;
      }
      this.$confirm(`${val ? `确定对[${val.username}]进行删除操作` : `确定对[id=${ids.join(',')}]进行批量删除`}操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUser(ids)
            .then(({ data: res }) => {
              if (res && res.code === this.$OkCode) {
                this.getUserPage();
              }
            })
            .catch((error) => {
              console.debug(error);
            });
        })
        .catch(() => {
          this.$message.info(`取消${val ? `删除[${val.username}]` : '批量删除'}`);
        });
    },
    init() {
      this.getUserPage();
      this.getDeptTree();
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
  beforeCreate() {},
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.init();
  },
  /**
   * 在挂载开始之前被调用：相关的 render 函数首次被调用。
   */
  beforeMount() {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
  /**
   * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
   * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
   */
  beforeUpdate() {},
  /**
   * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
   * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
   */
  updated() {},
  /**
   * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
   */
  activated() {},
  /**
   * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
   */
  deactivated() {},
  /**
   * 实例销毁之前调用。在这一步，实例仍然完全可用。
   */
  beforeDestroy() {},
  /**
   * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
   * 所有的事件监听器会被移除，所有的子实例也会被销毁。
   */
  destroyed() {},
};
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

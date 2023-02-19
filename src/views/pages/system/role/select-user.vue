<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022年12月10日 23点57分
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>

  <div>
    <el-dialog width="1035px" title="选择用户" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :inline="true" size="small" ref="formInline" :model="param.data" class="demo-form-inline">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="param.data.username" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="param.data.phonenumber" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <CommonSearchReset @reset="onReset" @search="getNotThisRoleUserPage"></CommonSearchReset>
        </el-form-item>
      </el-form>
      <el-table :data="tableData.list" border
                @selection-change="selectionChangeHandle">
          <el-table-column header-align="center" align="center" type="index" width="50">
          </el-table-column>
          <el-table-column header-align="center" align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="nickName" label="昵称"
            min-width="100">
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
          <el-table-column header-align="center" align="center" prop="userType" label="类型">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="状态">
            <template v-slot="scope">
              <el-tooltip :content="'Switch value: ' + scope.row.status" placement="top">
                <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="0"
                  inactive-value="1" disabled>
                </el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <CommonPagination :currPage.sync="tableData.currPage" 
        :pageSize.sync="tableData.pageSize" 
        :totalCount.sync="tableData.totalCount" 
        :page="param.page" 
        @pageReset="getNotThisRoleUserPage"></CommonPagination>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRoleBindUser">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
    
  </div>

</template>

<script>
import { getNotThisRoleUserPage,saveRoleBindUser } from '@/api/system/role.js';
import CommonSearchReset from '@/components/common/CommonSearchReset';
import CommonPagination from '@/components/common/CommonPagination';
export default {
  
  // 组件名称
  name: 'select-user',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {CommonSearchReset,CommonPagination},
  // 组件状态值
  data () {
    return {
      visible: false,
      tableData: Object,
      dataListSelections: [],
      param: {
        page: {
          page: 1,
          limit: 10
        },
        data: {
          username: '',
          phonenumber: '',
        }
      }
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    init(val){
      this.visible = true;
      this.param.data.roleId = val.roleId;
      this.$nextTick(() => {
        this.getNotThisRoleUserPage();
      });
    },
    onReset(){
      this.$nextTick(() => {
        this.$refs.formInline.resetFields();
      })
    },
    getNotThisRoleUserPage(){
      getNotThisRoleUserPage(this.param).then(({ data: res }) => {
        this.tableData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    selectionChangeHandle(val){
      this.dataListSelections = val
    },
    saveRoleBindUser(){
      let ids =  this.dataListSelections.map(item => {
        return item.userId
      })
      if (ids && !ids.length > 0) {
        this.$message.error('请选择要分配的用户');
        return
      }
      saveRoleBindUser({roleId: this.param.data.roleId, userIds: ids}).then(({ data: res }) => {
        if (res.code === this.$OkCode) {
          this.visible = false;
          this.$emit('refreshDataList')
        }
      }).catch(error => {
        console.log(error)
      });
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {

  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {

  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {

  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {

  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {

  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {

  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {

  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {

  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {

  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped>

</style>

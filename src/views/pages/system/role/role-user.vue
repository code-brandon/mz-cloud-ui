<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022年11月06日 11:26:21
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>

  <div>
    <el-dialog width="1035px" title="分配用户" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :inline="true" size="small" ref="formInline" :model="param.data" class="demo-form-inline">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="param.data.username" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="param.data.phonenumber" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="param.data.status" placeholder="用户状态">
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
            <el-option label="全部" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <CommonSearchReset @reset="onReset" @search="getUserPage"></CommonSearchReset>
        </el-form-item>
      </el-form>

      <CommonControlCard >
        <template>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addHandle()">
            新增
          </el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="deleteByRoleId()">
            批量解除
          </el-button>
        </template>
      </CommonControlCard>
    
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
          <el-table-column header-align="center" align="center" prop="email" label="邮箱" width="180">
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
                  inactive-value="1">
                </el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" fixed="right" label="操作" width="90">
            <template v-slot="scope">
              <el-popover popper-class="mz-popover" placement="top" width="110" trigger="hover">
                <p>确定解除吗？</p>
                <div style="text-align: center; margin: 0">
                  <el-button type="danger" round size="mini" @click="deleteByRoleId(scope.row.userId)">确定</el-button>
                </div>
                <el-button type="text" slot="reference" icon="el-icon-delete" size="mini">解除授权
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <CommonPagination :currPage.sync="tableData.currPage" 
        :pageSize.sync="tableData.pageSize" 
        :totalCount.sync="tableData.totalCount" 
        :page="param.page" 
        @pageReset="changePageReset"></CommonPagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
    <SelectUser v-if="selectUserVisible" ref="selectUser" @refreshDataList="getUserPage"></SelectUser>
  </div>

</template>

<script>
import { getUserPage ,deleteByRoleId} from '@/api/system/role.js';
import CommonControlCard from '@/components/common/CommonControlCard';
import CommonSearchReset from '@/components/common/CommonSearchReset';
import CommonPagination from '@/components/common/CommonPagination';
import SelectUser from './select-user.vue'
export default {
  
  // 组件名称
  name: 'role-user',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {CommonControlCard, CommonSearchReset,CommonPagination,SelectUser},
  // 组件状态值
  data () {
   return {
    visible: false,
    selectUserVisible: false,
     dataListSelections: [],
    tableData:Object,
    param:{
      page: {
        page: 1,
        limit: 10
      },
      data:{}
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
      console.log(val)
      this.param.data.roleId = val.roleId;
      this.$nextTick(() => {
        this.getUserPage();
      });
    },
    addHandle(){
      this.selectUserVisible = true
      this.$nextTick(() => {
        this.$refs.selectUser.init({roleId:this.param.data.roleId})
      })
    },
    onReset(){
      this.$nextTick(() => {
        this.$refs.formInline.resetFields();
      })
    },
    changePageReset(){
      this.getUserPage()
    },
    getUserPage(){
      getUserPage(this.param).then(({ data: res }) => {
        console.log(res)
        this.tableData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    selectionChangeHandle(val){
      this.dataListSelections = val
    },
    deleteByRoleId(val){
      let ids = val ? [val] : this.dataListSelections.map(item => {
        return item.userId
      })
      if (ids && !ids.length > 0) {
        this.$message.error('请选择解除的用户');
        return
      }
      deleteByRoleId({roleId:this.param.data.roleId,userIds:ids}).then(({ data: res }) => {
        if (res.code === this.$OkCode) {
          this.getUserPage();
        }
      }).catch(error => {
        console.log(error)
      })
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

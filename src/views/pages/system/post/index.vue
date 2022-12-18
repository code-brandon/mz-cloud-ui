<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/10/12 17:28
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div>

    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline" label-width="68px">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <CommonSearchReset
                @reset="getPostPage"
                @search="onSubmit"
        ></CommonSearchReset>
      </el-form-item>
    </el-form>

    <CommonControlCard
            @refresh="getPostPage"
    >
      <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
      >
        新增
      </el-button>
      <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
      >
        删除
      </el-button>
      <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
      >
        导入
      </el-button>
      <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
      >
        导出
      </el-button>
    </CommonControlCard>

    <el-table
            :data="tableData.list"
            border
            style="width: 100%;">
      <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
      </el-table-column>
      <el-table-column
              prop="postId"
              header-align="center"
              align="center"
              label="岗位ID">
      </el-table-column>
      <el-table-column
              prop="postCode"
              header-align="center"
              align="center"
              label="岗位编码">
      </el-table-column>
      <el-table-column
              prop="postName"
              header-align="center"
              align="center"
              label="岗位名称">
      </el-table-column>
      <el-table-column
              prop="postSort"
              header-align="center"
              align="center"
              label="显示顺序">
      </el-table-column>
      <el-table-column
              label="状态"
              header-align="center"
              width="80">
        <template v-slot="scope">
          <el-tooltip :content="'Switch value: ' + scope.row.status" placement="top">
            <el-switch
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="0"
                    inactive-value="1">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
              prop="createBy"
              header-align="center"
              align="center"
              label="创建者">
      </el-table-column>
      <el-table-column
              prop="createTime"
              header-align="center"
              align="center"
              width="180"
              label="创建时间">
      </el-table-column>
      <el-table-column
              prop="updateBy"
              header-align="center"
              align="center"
              label="更新者">
      </el-table-column>
      <el-table-column
              prop="updateTime"
              header-align="center"
              align="center"
              width="180"
              label="更新时间">
      </el-table-column>
      <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              header-align="center"
              align="center"
              label="备注">
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="180"
              label="操作">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="text" icon="el-icon-plus" size="small">添加</el-button>
          <el-popover
                  popper-class="mz-popover"
                  placement="top"
                  width="110"
                  trigger="hover">
            <p>确定删除吗？</p>
            <div style="text-align: center; margin: 0">
              <el-button type="danger" round size="mini" >确定</el-button>
            </div>
            <el-button style="margin-left: 10px" type="text" slot="reference" icon="el-icon-delete" size="small">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableData.currPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="tableData.totalCount">
    </el-pagination>
  </div>
</template>

<script>
  import {getPostPage} from '@/api/system/post'
  import CommonControlCard from '@/components/common/CommonControlCard';
  import CommonSearchReset from '@/components/common/CommonSearchReset';
  export default {
    // 组件名称
    name: 'Post',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {CommonControlCard,CommonSearchReset},
    // 组件状态值
    data() {
      return {
        param: {
          page: {
            page: 1,
            limit: 10
          },
        },
        formInline: {
          user: '',
          region: ''
        },
        tableData:[],
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
      }
    },
    // 组件方法
    methods: {
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleNodeClick(val){
        console.log(`节点数据: ${val.id}`);
      },
      onSubmit() {
        console.log('submit!');
      },
      getPostPage(){
        getPostPage(this.param).then(({data:res})=>{
          if (res.code === this.$OkCode) {
            this.tableData = res.data
          }
        }).catch(error=>{
          console.log(error)
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
      this.getPostPage();
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

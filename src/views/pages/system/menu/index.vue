<!--
  功能：功能描述
  作者：小政同学
  邮箱：1911298402@qq.com
  时间：2022/10/10 13:50
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
-->
<template>
  <div>
    <el-form :inline="true" size="small" :model="param.data" ref="formInline" class="demo-form-inline" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="param.data.menuName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-select v-model="param.data.status" placeholder="请选择状态">
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <CommonSearchReset @reset="onReset" @search="getMenuListTree"></CommonSearchReset>
      </el-form-item>
    </el-form>
    <CommonControlCard @refresh="getMenuListTree">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle({type:0})">
        新增
      </el-button>
      <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">
        展开/折叠
      </el-button>
    </CommonControlCard>

    <el-table v-if="refreshTable" :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="menuId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="menuName" label="菜单名称"
        width="180">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="图标" width="60">
        <template v-slot="scope">
          <!-- <i :class="scope.row.icon"></i> -->
          <MzIcon :allName="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="weight" width="60" label="排序">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="perms" label="权限标识符">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="component" label="组件路径">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="状态" width="80">
        <template v-slot="scope">
          <el-tag :type="scope.row.status > 0 ? 'danger' : 'dark'" effect="plain">
            {{ scope.row.status > 0 ? '停用' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="显示状态" width="80">
        <template v-slot="scope">
          <el-tag :type="scope.row.visible > 0 ? 'danger' : 'dark'" effect="plain">
            {{ scope.row.visible > 0 ? '隐藏' : '显示' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="缓存状态" width="80">
        <template v-slot="scope">
          <el-tag :type="scope.row.isCache > 0 ? 'danger' : 'dark'" effect="plain">
            {{ scope.row.isCache > 0 ? '不缓存' : '缓存' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" header-align="center" align="center" prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column header-align="center" align="center" fixed="right" label="操作" width="180">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle({menuId:scope.row.menuId,type:1})">编辑</el-button>
          <el-button type="text" icon="el-icon-plus" size="small" @click="addOrUpdateHandle({menuId:scope.row.menuId,type:2})">添加</el-button>
          <el-button style="margin-left: 10px" type="text" slot="reference" icon="el-icon-delete" size="small" @click="deleteMenu(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getMenuListTree"></AddOrUpdate>
  </div>
</template>

<script>
import {getMenuListTree, deleteMenu} from '@/api/system/menu.js';
import AddOrUpdate from './add-or-update'
import CommonControlCard from '@/components/common/CommonControlCard';
import CommonSearchReset from '@/components/common/CommonSearchReset';
export default {
  // 组件名称
  name: 'Menu',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: { CommonControlCard, AddOrUpdate, CommonSearchReset },
  // 组件状态值
  data() {
    return {
      addOrUpdateVisible: false,
      tableData: [],
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      param: {
        data: {
          menuName:'',
          status:'',
        }
      },
    }
  },
  // 组件方法
  methods: {
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    getMenuListTree() {
      getMenuListTree(this.param).then(({ data: res }) => {
        this.tableData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    addOrUpdateHandle(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    deleteMenu(val){
      if(!val){
        this.$message.error("请选择要删除的数据")
        return
      }
      this.$confirm(`确定对[${val.menuName}]进行删除操作操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu([val.menuId]).then(({ data: res }) => {
          if (res && res.code === this.$OkCode) {
            this.getMenuListTree();
          }
        }).catch(err => {
          console.error(err)
        })
      }).catch(()=>{
        this.$message.info(`取消删除[${val.menuName}]`);
      })
      
    },
    onReset() {
      this.$nextTick(() => {
        this.$refs.formInline.resetFields();
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
    this.getMenuListTree();
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
    clearInterval(this.timer)
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

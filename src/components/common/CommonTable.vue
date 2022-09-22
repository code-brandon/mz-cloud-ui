<template>
  <div class="common-table">
    <el-table
            :data="tableData"
            height="90%"
            stripe>
      <el-table-column
              show-overflow-tooltip
              v-for="item in tableLabel"
              :key="item.prop"
              :label="item.label"
              :width="item.width ? item.width : 125">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            @size-change="changeSize"
            @current-change="changePage"
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
    export default {
        name: "CommonTable",
        props:{
            tableData: Array,
            tableLabel: Array,
            config:Object
        },
        data() {
            return {

            }
        },
        methods:{
            handleEdit(row){
              this.$emit('edit',row)
            },
            handleDelete(row){
                this.$emit('del',row)
            },
            changePage(page){
                this.$emit('changePage',page)
            },
            changeSize(size){
                this.$emit('changePage',size)
            }
        }
    }
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 60px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
</style>

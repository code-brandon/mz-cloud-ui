<template>
   <!-- card body -->
   <div class="iconSelect">
      
      <div class="iconList">
        <div class="iconInput">
          <el-input placeholder="请输入内容" v-model="iconSelectValue" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </div>
        <VirtualList :items="jsonIconGroup" class="iconGroup">
        <template #default="{ item, index }">
          <div style="display: flex" :key="'icon-dev-'+index">
            <!-- {{ item }} -->
            <div class="mz-select-icon" v-for="(icon,indexIcon) in item" @click="handleIcon(icon)">
              <MzIcon :allName="icon" />
              <!-- <i :class="icon"  :key="'icon-' + indexIcon"></i> -->
            </div>
          </div>
        </template>
      </VirtualList>
      </div>
    </div>
</template>

<script>
import { arrayGroup } from 'utils/mz-utils.js';
import svgIcons from './svg-icons'
const json = require('@/assets/json/icons.json');
export default {
  name: "selectIcon",
  props: {
    
  },
  computed: {
    jsonIcon() {
      let icons = [...svgIcons];
      let temp = Object.values(json);
      temp.forEach((i) => {
        icons.push(...i);
      });
      return icons;
    },
    jsonIconGroup() {
      let temp = this.jsonIcon.filter(f=>f.includes(this.iconSelectValue))
      return arrayGroup(temp, 10);
    },
  },
  data() {
    return {
      iconSelectValue:''
    }
  },
  methods: {
    handleIcon(iconName) {
      this.$emit('input', iconName)
    },
  }
}
</script>

<style lang="less" scoped>
.iconSelect {
  // width: 500px;
  // border: 1px solid salmon;
  // padding: 18px;
}
.iconInput{
  /* padding: 0px 20px 15px 20px; */
  padding-bottom: 5px;
}
.iconList{
  /* padding: 10px 0;
    border: 1px solid; */
}
.iconGroup {
  display: flex;
  height: 300px;
  /* justify-content: center; */
}
.mz-select-icon {
  width: 45px !important;
  height: 45px !important;
  font-size: 20px !important;
  border: 0.01em solid #dcdfe6 !important;
  /* display: flex;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center; */
  text-align: center;
  line-height: 45px;
}
</style>

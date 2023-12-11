<template>
  <div>
    <el-alert class="gateway-alert" :closable="false" title="危险操作提示" type="error" description="设置动态路由是件非常专业的事情，非专业人员请勿操作！！！" show-icon> </el-alert>
    <el-button type="warning" :disabled="!validateOk" size="mini" @click="handleSave">保存</el-button>
    <el-button type="primary" size="mini" @click="handleReplace">表单重置</el-button>
    <el-button type="danger" size="mini" @click="handleRuleReplace">路由重置</el-button>
    <div id="jsoneditor" class="jsoneditor" ref="jsoneditor" style=""></div>
  </div>
</template>

<script>
import jsoneditor from 'jsoneditor';
import { deepEqual, arrayGroup } from 'utils/mz-utils.js';
import { getGatewayList, saveOrUpdate,resetRoute } from '@/api/system/gateway';
export default {
  name: 'Gateway',
  components: {},
  /* eslint-disable vue/require-prop-types */
  props: {},
  computed: {},
  data() {
    return {
      jsonEditor: null,
      validateOk: true,
      gatewatList: [],
    };
  },
  mounted() {
    this.initJsonEditor();
    this.getGatewayList();
  },
  methods: {
    getGatewayList() {
      getGatewayList().then(({ data: res }) => {
        if (res && res.code !== this.$OkCode) {
          return;
        }
        this.gatewatList = res.data;
        this.handleReplace();
      });
    },
    handleRuleReplace() {
      this.$confirm(`确定进行重置网关路由操作?`, '危险', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          resetRoute()
            .then(({ data: res }) => {
              if (res && res.code !== this.$OkCode) {
                return;
              }
              this.$message({
                showClose: true,
                message: '重置网关路由成功，请查看网关状态！！',
                type: 'warning',
                duration: 6000,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message.info(`取消重置网关路由`);
        });
    },
    handleReplace() {
      this.jsonEditor.set(this.gatewatList);
      this.validateOk = true;
    },
    handleSave() {
      let newGatewList = this.getValue();
      console.log(newGatewList);
      let isChange = deepEqual(this.gatewatList, newGatewList);
      console.log(isChange);
      this.$confirm(`数据[${isChange ? '无' : '有'}]变化，确定进行保存操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        saveOrUpdate(newGatewList)
          .then(({ data: res }) => {
            if (res && res.code !== this.$OkCode) {
              return;
            }
            this.$message({
              showClose: true,
              message: '保存成功了，但未使网关生效，请手动重置网关路由',
              type: 'warning',
              duration: 6000,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch(() => {
        this.$message.info(`取消保存路由信息`);
      });
    },
    // 初始化jsonEditor
    initJsonEditor() {
      // var container = document.getElementById('jsoneditor');
      let that = this;
      var container = this.$refs.jsoneditor;
      var options = {
        mode: 'tree',
        modes: ['code', 'view', 'form', 'tree', 'preview'], // allowed modes
        // error: function (err) {
        //   alert('EF1 ->' + err.toString());
        // },
        onChange(text) {
          // 加载完成，JSON数据发生变化触发的函数
          console.log('加载完成，JSON数据发生变化触发的函数');
        },
        onChangeJSON(json) {
          // 数据发生变化，改变之后的json
          console.log('数据发生变化，改变之后的json');
        },
        onChangeText(text) {
          // 数据发生变化，改变之后的字符串
          console.log('数据发生变化，改变之后的字符串');
          // console.log(text);
          that.jsonEditor
            .validate()
            .then((res) => {
              if (res.length == 0) {
                that.validateOk = true;
              } else {
                that.validateOk = false;
              }
            })
            .catch((err) => {
              console.log(that.validateOk, err);
            });
        },
        onError(error) {
          // 主动的修改已触发发生错误时
          console.log('主动的修改已触发发生错误时');
        },
        onValidationError: function (errors) {
          errors.forEach((error) => {
            console.debug(error);
          });
        },
        history: true,
        templates: [
          {
            text: 'RuleInfo',
            title: 'Insert a Rule Node',
            field: 'RuleTemplate',
            value: {
              "routeId": "mz-RuleTemplate",
              "routeName": "MZRuleTemplate",
              "predicates": [
                  {
                      "name": "Path",
                      "args": {
                          "_genkey_0": "/api/auth/**"
                      }
                  }
              ],
              "metadata": {},
              "filters": [
                  {
                      "name": "RewritePath",
                      "args": {
                          "_genkey_0": "/api/auth/(?<segment>.*)",
                          "_genkey_1": "/$\\{segment}"
                      }
                  }
              ],
              "routeUri": "lb://mz-auth",
              "status": "0",
              "remark": "",
              "order": 0
          },
          },
        ],
      };
      var editor = new jsoneditor(container, options);
      this.jsonEditor = editor;
      editor.expandAll();
    },
    // 获取json
    getValue() {
      return this.jsonEditor.get();
    },
  },
};
</script>
<style scoped>
#jsoneditor {
  width: 100%;
  height: 600px;
  margin-top: 20px;
}
.gateway-alert {
  margin-bottom: 20px;
}
</style>

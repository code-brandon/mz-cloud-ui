<template>
  <el-dialog class="mz-el-dialog" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="公告标题" prop="noticeTitle">
            <el-input v-model="dataForm.noticeTitle" placeholder="公告标题"></el-input>
          </el-form-item>
        </el-col>
    
        <el-col :sm="24" :md="12">
          <el-form-item label="公告类型" prop="noticeType">
            <el-select v-model="dataForm.noticeType" placeholder="公告类型">
              <el-option label="通知" value="1"></el-option>
              <el-option label="公告" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="公告内容" prop="noticeContent">
            <mavon-editor v-model="dataForm.noticeContent" :subfield="false" />
          </el-form-item>
        </el-col>
      </el-row>
    
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveNotice,updateNotice,getNoticeInfo } from "@/api/system/notice";
export default {
  data() {
    return {
      visible: false,
      markdownOption:{
        preview: false,
        bold: true, // 粗体
      italic: true,// 斜体
      header: true,// 标题
      },
      dataForm: {
        noticeId: '',
        noticeTitle: '',
        noticeType: '',
        noticeContent: '',
        remark: ''
      },
      dataRule: {
        noticeTitle: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态（0正常 1停用）不能为空', trigger: 'blur' }
        ],
        /* remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ] */
      }
    }
  },
  methods: {
    init(noticeId) {
      this.dataForm.noticeId = noticeId
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.noticeId) {
          getNoticeInfo(this.dataForm.noticeId).then(({ data: res }) => {
            if (res.code === this.$OkCode) {
              this.dataForm = res.data
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.noticeId) {
            saveNotice({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          } else {
            updateNotice({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          }
        }
      })
    }
  }
}
</script>
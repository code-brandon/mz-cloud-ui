<template>
  <el-dialog class="mz-el-dialog" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="dataForm.dictName" placeholder="字典名称"></el-input>
          </el-form-item>
        </el-col>
    
        <el-col :sm="24" :md="12">
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="dataForm.dictType" placeholder="字典类型"></el-input>
          </el-form-item></el-col>
    
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
    
        <el-col :sm="24" :md="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
import {saveDictType,updateDictType,getDictTypeInfo} from '@/api/system/dict'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        dictId: '',
        dictName: '',
        dictType: '',
        status: '0',
        remark: ''
      },
      dataRule: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
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
    init(dictId) {
      this.dataForm.dictId = dictId
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.dictId) {
          getDictTypeInfo(this.dataForm.dictId).then(({ data: res }) => {
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
          if (!this.dataForm.dictId) {
            saveDictType({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          } else {
            updateDictType({ ...this.dataForm }).then(({ data: res }) => {
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

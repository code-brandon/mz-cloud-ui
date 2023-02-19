<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="dataForm.dictType" disabled placeholder="字典类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="字典排序" prop="dictSort">
            <el-input-number v-model="dataForm.dictSort" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="字典键值" prop="dictValue">
            <el-input v-model="dataForm.dictValue" placeholder="字典键值"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="24" :md="12">
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="dataForm.dictLabel" placeholder="字典标签"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="表格回显样式" prop="listClass">
            <el-input v-model="dataForm.listClass" placeholder="表格回显样式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="样式属性" prop="cssClass">
            <el-input v-model="dataForm.cssClass" placeholder="样式属性（其他样式扩展）"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item label="是否默认" prop="isDefault">
            <el-radio-group v-model="dataForm.isDefault">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {saveDictData,updateDictData,getDictDataInfo} from '@/api/system/dict'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        dictCode: '',
        dictSort: '',
        dictLabel: '',
        dictValue: '',
        dictType: '',
        cssClass: '',
        listClass: '',
        isDefault: 'Y',
        status: '0',
        remark: ''
      },
      dataRule: {
        dictSort: [
          { required: true, message: '字典排序不能为空', trigger: 'blur' }
        ],
        dictLabel: [
          { required: true, message: '字典标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '字典键值不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        /* cssClass: [
          { required: true, message: '样式属性（其他样式扩展）不能为空', trigger: 'blur' }
        ],
        listClass: [
          { required: true, message: '表格回显样式不能为空', trigger: 'blur' }
        ], */
        isDefault: [
          { required: true, message: '是否默认（Y是 N否）不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态（0正常 1停用）不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建者不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateBy: [
          { required: true, message: '更新者不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ],
        /* remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ] */
      }
    }
  },
  methods: {
    init(dictData) {
      if (dictData) {
        this.dataForm.dictCode = dictData.dictCode
        this.dataForm.dictType = dictData.dictType
      } else {
        this.dataForm.dictCode = ''
      }
      
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.dictCode) {
          getDictDataInfo(this.dataForm.dictCode).then(({ data: res }) => {
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
          if (!this.dataForm.dictCode) {
            saveDictData({ ...this.dataForm }).then(({ data: res }) => {
              if (res.code === this.$OkCode) {
                this.visible = false
                this.$emit('refreshDataList')
              }
            }).catch(error => {
              console.error(error)
            })
          } else {
            updateDictData({ ...this.dataForm }).then(({ data: res }) => {
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

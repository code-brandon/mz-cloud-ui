import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getDictDataPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  },{
    successShow: false
  })
}

export const getDictDataInfo = (dictCode) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/info/${dictCode}`,
    method: 'get',
    data: null
  })
}

/**
 * 根据字典类型 返回字典值
 * @param dictType 字典类型
 * @returns {AxiosPromise}
 */
export const getDictDataByType = (dictType) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/type/${dictType}`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const saveDictData = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/save`,
    method: 'post',
    data: param
  })
}

export const updateDictData = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/update`,
    method: 'put',
    data: param
  })
}

export const updateDictDataStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/update/status`,
    method: 'put',
    data: param
  })
}

export const deleteDictData= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/delete`,
    method: 'delete',
    data: param
  },{
    successShow: false
  })
}


export const getDictTypePage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: null
  },{
    successShow: false
  })
}

export const getDictTypeInfo = (dictId) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/info/${dictId}`,
    method: 'get',
    data: null
  })
}

export const saveDictType = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/save`,
    method: 'post',
    data: param
  })
}

export const updateDictType = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/update`,
    method: 'put',
    data: param
  })
}

export const updateDictTypeStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/update/status`,
    method: 'put',
    data: param
  })
}

export const deleteDictType= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/delete`,
    method: 'delete',
    data: param
  })
}
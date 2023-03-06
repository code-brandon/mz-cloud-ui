import axios from '@/config/request.js'
import qs from "qs";

const basePath = '/api/system'

export const getDeptList = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/getList?${qs.stringify(param.data)}`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const getDeptTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysdept/getDeptTree`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const getDeptListTree = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/getDeptListTree?${qs.stringify(param.data)}`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const getDeptInfo = (deptId) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/info/${deptId}`,
    method: 'get',
    data: null
  })
}

export const saveDept= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/save`,
    method: 'post',
    data: param
  })
}

export const deleteDept= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/delete`,
    method: 'delete',
    data: param
  })
}

export const updateDept= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdept/update`,
    method: 'put',
    data: param
  })
}

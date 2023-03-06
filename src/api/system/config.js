import axios from '@/config/request.js'
import qs from "qs";

const basePath = '/api/system'

export const getConfigPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysconfig/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  },{
    successShow: false
  })
}

export const getConfigInfo = (configId) => {
  return axios.request({
    url: `${basePath}/admin/sysconfig/info/${configId}`,
    method: 'get',
    data: null
  })
}

export const saveConfig = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysconfig/save`,
    method: 'post',
    data: param
  })
}

export const deleteConfig = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysconfig/delete`,
    method: 'delete',
    data: param
  })
}

export const updateConfig = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysconfig/update`,
    method: 'put',
    data: param
  })
}

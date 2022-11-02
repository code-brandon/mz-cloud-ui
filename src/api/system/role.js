import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getRolePage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrole/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  })
}

export const getRoleList = () => {
  return axios.request({
    url: `${basePath}/admin/sysrole/list`,
    method: 'post',
    data: null
  })
}

export const getRoleInfo = (roleId) => {
  return axios.request({
    url: `${basePath}/admin/sysrole/info/${roleId}`,
    method: 'get'
  })
}


export const updateRole = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrole/update`,
    method: 'put',
    data: param
  })
}


export const saveRoleMenu = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrolemenu/saveRoleMenu`,
    method: 'post',
    data: param
  })
}

export const updateRoleMenu = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrolemenu/updateRoleMenu`,
    method: 'put',
    data: param
  })
}

export const saveRoleDept = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysroledept/saveRoleDept`,
    method: 'post',
    data: param
  })
}

export const listRoleDept = (roleId) => {
  return axios.request({
    url: `${basePath}/admin/sysroledept/list/${roleId}`,
    method: 'get',
    data: null
  })
}
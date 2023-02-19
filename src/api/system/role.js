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

export const updateRoleStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrole/update/status`,
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

export const deleteRole= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysrole/delete`,
    method: 'delete',
    data: param
  })
}

export const saveRoleDept = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysroledept/save`,
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

export const getUserPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuserrole/getUserPage?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  })
}

export const getNotThisRoleUserPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuserrole/getNotThisRoleUserPage?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  })
}
export const saveRoleBindUser = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuserrole/save/roleBindUser`,
    method: 'post',
    data: param
  })
}

export const deleteByRoleId = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuserrole/delete`,
    method: 'delete',
    data: param
  })
}

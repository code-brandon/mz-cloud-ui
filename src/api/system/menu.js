import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getUserMenuTree= () => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getUserMenuTree`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const getMenuTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getMenuTree`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

export const getMenuInfo = (menuId) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/info/${menuId}`,
    method: 'get',
    data: null
  })
}

export const saveMenu= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/save`,
    method: 'post',
    data: param
  })
}

export const updateMenu= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/update`,
    method: 'put',
    data: param
  })
}

export const deleteMenu= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/delete`,
    method: 'delete',
    data: param
  })
}

export const getMenuListTree = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getMenuListTree?${qs.stringify(param.data)}`,
    method: 'get',
    data: null
  },{
    successShow: false
  })
}

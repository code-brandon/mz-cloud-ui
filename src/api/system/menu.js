import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getUserMenuTree= () => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getUserMenuTree`,
    method: 'get',
    data: null
  })
}

export const getMenuTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getMenuTree`,
    method: 'get',
    data: null
  })
}

export const getMenuInfo = (menuId) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/info/${menuId}`,
    method: 'get',
    data: null
  })
}

export const getMenuListTree = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getMenuListTree?${qs.stringify(param.data)}`,
    method: 'get',
    data: null
  })
}

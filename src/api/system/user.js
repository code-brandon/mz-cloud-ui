import axios from '@/config/request.js'
import qs from 'qs';
import store from '@/store'

const basePath = '/api/system'

export const logout = () => {
	return axios.request({
    url: `/api/auth/logout`,
    method: 'post'
	})
}

export const getUser = () => {
  return axios.request({
    url: `${basePath}/admin/sysuser/getUser`,
    method: 'get',
  })
}

export const login = (param) => {
  return axios.request({
    url: `/api/auth/oauth/token?grant_type=password`,
    headers: {
      isToken: false,
      captchaId: store.getters.captchaId,
      authorization: "Basic bXpfY2xvdWQ6MTkxMTI5ODQwMg==",
      "content-type": "application/x-www-form-urlencoded"
    },
    method: 'post',
    data: qs.stringify(param)
  },{
    ok_message: '登录成功'
  })
}

export const getUserPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/page?page=${param.page.page}&limit=${param.page.limit}`,
    method: 'post',
    data: param.data
  },{
    successShow: false
  })
}

export const getUserInfo = (userId) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/info/${userId}`,
    method: 'get'
  })
}

export const saveUser = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/save`,
    method: 'post',
    data: param
  })
}

export const updateUser = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/update`,
    method: 'put',
    data: param
  })
}

export const updateUserStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/update/status`,
    method: 'put',
    data: param
  })
}

export const deleteUser= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/delete`,
    method: 'delete',
    data: param
  })
}

export const resetPasswd = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/resetPasswd`,
    method: 'put',
    data: param
  })
}


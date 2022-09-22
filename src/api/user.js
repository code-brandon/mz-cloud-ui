import axios from '@/config/request.js'
import qs from 'qs';

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
        method: 'get'
    })
}

export const login = (param) => {
  return axios.request({
    url: `/api/auth/oauth/token?grant_type=password`,
    headers: {
      isToken: false,
      authorization: "Basic bXpfY2xvdWQ6MTkxMTI5ODQwMg==",
      "content-type":"application/x-www-form-urlencoded"
    },
    method: 'post',
    data: qs.stringify(param)
  })
}

export const getUserPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysuser/page?page=${param.page.page}&limit=${param.page.limit}`,
    method: 'post',
    data: param.data
  })
}

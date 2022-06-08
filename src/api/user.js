import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/admin'

export const getMenu = (param) => {
	return axios.request({
		url: '/permission/getMenu',
		method: 'post',
		data: param
	})
}

export const getData = () => {
	return axios.request({
		url: '/home/getData',
		method: 'get'
	})
}

export const getUser = (params) => {
    return axios.request({
        url: '/user/getUser',
        method: 'get',
        params
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

import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getPostPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: null
  })
}

export const getPostList = () => {
  return axios.request({
    url: `${basePath}/admin/syspost/list`,
    method: 'post',
    data: null
  })
}

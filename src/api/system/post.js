import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getPostPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  })
}

export const getPostInfo = (postId) => {
  return axios.request({
    url: `${basePath}/admin/syspost/info/${postId}`,
    method: 'get',
    data: null
  })
}

export const updatePostStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/update/status`,
    method: 'put',
    data: param
  })
}

export const updatePost = (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/update`,
    method: 'put',
    data: param
  })
}

export const savePost = (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/save`,
    method: 'post',
    data: param
  })
}

export const deletePost= (param) => {
  return axios.request({
    url: `${basePath}/admin/syspost/delete`,
    method: 'delete',
    data: param
  })
}

export const getPostList = () => {
  return axios.request({
    url: `${basePath}/admin/syspost/list`,
    method: 'post',
    data: null
  })
}

import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getNoticePage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: param.data
  },{
    successShow: false
  })
}

export const updateNotice = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/update`,
    method: 'put',
    data: param
  })
}

export const updateNoticeStatus = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/update/status`,
    method: 'put',
    data: param
  })
}

export const saveNotice = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/save`,
    method: 'post',
    data: param
  })
}

export const getNoticeInfo = (noticeId) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/info/${noticeId}`,
    method: 'get',
    data: null
  })
}


export const deleteNotice= (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/delete`,
    method: 'delete',
    data: param
  })
}
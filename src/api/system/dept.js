import axios from '@/config/request.js'

const basePath = '/api/system'

export const getDeptTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysdept/getDeptTree`,
    method: 'get',
    data: null
  })
}

export const getDeptListTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysdept/getDeptListTree`,
    method: 'get',
    data: null
  })
}

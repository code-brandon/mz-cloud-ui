import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getDictDataPage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdictdata/page?${qs.stringify(param.page)}&${qs.stringify(param.data)}`,
    method: 'post',
    data: param.data
  })
}

export const getDictTypePage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysdicttype/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: null
  })
}

import axios from '@/config/request.js'
import qs from 'qs';

const basePath = '/api/system'

export const getNoticePage = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysnotice/page?${qs.stringify(param.page)}`,
    method: 'post',
    data: null
  })
}

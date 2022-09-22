import axios from '@/config/request.js'

const basePath = '/api/system'

export const getMenuTree = () => {
  return axios.request({
    url: `${basePath}/admin/sysmenu/getMenuTree`,
    method: 'get',
    data: null
  })
}

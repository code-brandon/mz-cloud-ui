import axios from '@/config/request.js';
import qs from 'qs';

const basePath = '/api/system';

/**
 * 获取路由列表
 * @returns axios
 */
export const getGatewayList = () => {
  return axios.request({
    url: `${basePath}/admin/sysgatewayroute/list`,
    method: 'get',
  });
};

/**
 * 更新或保存路由
 * @returns axios
 */
export const saveOrUpdate = (param) => {
  return axios.request({
    url: `${basePath}/admin/sysgatewayroute/saveOrUpdate`,
    method: 'post',
    data: param,
  },{
    successShow: false
  });
};

/**
 * 重置路由
 * @returns axios
 */
export const resetRoute = () => {
  return axios.request({
    url: `${basePath}/admin/sysgatewayroute/resetRoute`,
    method: 'put'
  });
};

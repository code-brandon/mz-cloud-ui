import axios from 'axios'

import qs from "qs";



export const bingBg = () => {
  /*axios.interceptors.request.use((config) => {
    config.headers['Origin'] = "";
    config.headers['Referer'] = "";
    config.headers["Access-Control-Allow-Origin"] = "*" // 允许所有的地址访问该服务器
    config.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS' // 允许可以跨域的请求方式
    config.headers['Access-Control-Allow-Headers'] = "'mytoken', 'Content-Type'" // 允许的请求头设置的内容类型
    return config
  });*/
  return axios({
    url: `/biying/hp/api/model`,
    method: 'get',
  })
}

export const getIcons = () => {
  return axios.request({
    url: `assets/icons/icons.json`,
    method: 'get',
  },{
    successShow: false
  })
}
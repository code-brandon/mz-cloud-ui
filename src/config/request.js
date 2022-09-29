import Axios from 'axios'
import Config from './ENV.js'
import store from '@/store'
import router from '@/router'

import {Notification, MessageBox, Message, Loading} from 'element-ui'

const baseUrl = process.env.NODE_ENV === "development" ? Config.baseUrl.dev : Config.baseUrl.pro
console.log(process.env, baseUrl)

class HttpRequest {
  /**
   * 构造函数
   * @param {Object} baseUrl 基础URL
   */
  constructor(baseUrl) {
    // 讲baseUrl 复制给 HttpRequest对象内部
    this.baseUrl = baseUrl
  }

  /**
   * 获取内部配置
   */
  getInsideConfig() {
    const config = {
      // TODO 注意配置文件正确的参数
      baseURL: this.baseUrl,
      headers: {},
      timeout: 12000 // request timeout
    }
    return config
  }

  /**
   * 拦截器
   * @param {Object} instance axios实例
   */
  interceptors(instance) {
    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      // 在请求被发送之前做些什么

      // 是否需要设置 token
      const isToken = (config.headers || {}).isToken === false
      // 是否需要防止数据重复提交
      const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
      const token = store.getters.token;
      if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改
        delete config.headers.isToken
      }
      return config;
    }, function (error) {
      // 处理请求错误
      return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {

      if (response.data.code > 15000 && response.data.code < 20000 ) {

        if (response.data.code === 15004 && !response.config.url.includes('oauth/token','login','auth/logout')) {
          MessageBox.alert(response.data.message, "登录失效", {
            confirmButtonText: "跳转登录页面",
            callback: action => {
              // 跳转登录页
              store.commit('CLEAR_TOKEN')
              store.commit('CLEAR_USER')
              router.push('/login')
            }
          });
        } else {
          Message.error(response.data.message ? response.data.message : "用户登录状态失效");
        }

      }else if (response.status === 200) {
        if (response.data.code === 1) {
          Message({
            title: "错误",
            message: response.data.message,
            type: "error"
          });

        }
        if (response.data.code === 0) {
          /*Message({
            title: "成功",
            message: `操作成功`,
            type: "success"
          });*/
          Notification({
            title: '成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          });

        }
      }
      // 对响应数据做些什么
      return response;
    }, function (error) {
      if (error.response.status == 401) {
        Message({
          title: "警告",
          message: error.response.data.message,
          type: "warning"
        });
      }
      // 处理响应错误
      return Promise.reject(error);
    });
  }

  /**
   * 请求
   * @param {Object} options 选项
   */
  request(options) {
    const instance = Axios.create()
    options = {...this.getInsideConfig(), ...options}
    // axios实例 给拦截器进行配置
    this.interceptors(instance)
    // axios实例 配置
    return instance(options)
  }

}

export default new HttpRequest(baseUrl)

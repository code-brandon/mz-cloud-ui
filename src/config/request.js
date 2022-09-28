import Axios from 'axios'
import Config from './ENV.js'
import store from '@/store'
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
      // 对响应数据做些什么
      return response;
    }, function (error) {
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

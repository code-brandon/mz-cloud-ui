import Cookies from 'js-cookie'
import {getUser, login, logout} from '@/api/system/user.js';

export default {
  state: {
    token: '',
    avatar: '',
    user: Object,
    auth: [],
  },
  mutations: {
    SET_TOKEN(state, val) {
      let tokenValue = val.access_token;
      state.token = tokenValue
      Cookies.set('token', tokenValue)
      Cookies.set('tokenData', JSON.stringify(val))
    },
    SET_AVATAR(state, val) {
      state.avatar = val
      Cookies.set('avatar', val)
    },
    SET_USER(state, val) {
      state.user = val
      Cookies.set('user', JSON.stringify(val))
    },
    SET_AUTH(state, val) {
      state.auth = val
      Cookies.set('auth', JSON.stringify(val))
    },
    CLEAR_USER(state) {
      state.user = {};
      Cookies.remove('user')
    },
    CLEAR_AUTH(state) {
      state.auth = [];
      Cookies.remove('auth')
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      Cookies.remove('token')
      Cookies.remove('tokenData')
    },
    GET_TOKEN(state) {
      state.token = state.token || Cookies.get('token');
    },
    GET_AUTH(state) {
      state.auth = !state.auth ? state.auth : JSON.parse(Cookies.get('auth'));
    },
  },
  actions: {
    // 登录
    Login({commit}, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid

      return new Promise((resolve, reject) => {
        login({username, password, code, uuid}).then(({data: res}) => {
          if (res.code === 0) {
            commit('SET_TOKEN', res.data);
          }
          // console.log(res)
          // commit('SET_TOKEN', res);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取Token
    GetToken({commit}) {
      commit('GET_TOKEN', this)
    },
    // 获取权限
    GetAuth({commit}) {
      commit('GET_AUTH', this)
    },
    // 获取用户信息
    GetInfo({commit}) {
      return new Promise((resolve, reject) => {
        getUser().then(({data: res}) => {
          if (res.code === 0) {
            let user = res.data
            commit('SET_USER', user)
            commit('SET_AUTH', user.authorities)
            const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
            commit('SET_AVATAR', avatar)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出系统
    LogOut({commit, state}) {
      let that = this;
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          that.dispatch('UserCLear')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    UserCLear({commit, state}) {
      commit('CLEAR_TOKEN', state)
      commit('CLEAR_USER', state)
      commit('CLEAR_MENU', state)
      commit('CLEAR_AUTH', state)
    }
  }
}

import Cookies from 'js-cookie'
import {login,getUser} from '@/api/user.js';
export default {
  state:{
    token:'',
    avatar: '',
    user: Object
  },
  mutations:{
    SET_TOKEN(state, val) {
      let tokenValue = val.access_token;
      state.token = tokenValue
      Cookies.set('token',tokenValue)
      Cookies.set('tokenData',JSON.stringify(val))
    },
    SET_AVATAR(state, val) {
      state.avatar = val
      Cookies.set('avatar',val)
    },
    SET_USER(state, val) {
      state.user = val
      Cookies.set('user',JSON.stringify(val))
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      Cookies.remove('token')
    },
    GET_TOKEN(state) {
      state.token = state.token || Cookies.get('token');
    },
  },
  actions:{
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return  new Promise((resolve, reject) => {
        login({username, password, code, uuid}).then(({data:res}) => {
          console.log(res)
          commit('SET_TOKEN', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取Token
    GetToken({ commit }){
      commit('GET_TOKEN',this)
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUser().then(({data:res}) => {
          let  user = res.data
          commit('SET_USER',user)
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          commit('SET_AVATAR',avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('CLEAR_TOKEN', state)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

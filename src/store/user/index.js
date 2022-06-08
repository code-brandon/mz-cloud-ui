import Cookies from 'js-cookie'
import {login} from '@/api/user.js';
export default {
  state:{
    token:''
  },
  mutations:{
    SET_TOKEN(state, val) {
      debugger
      let tokenValue = val.access_token;
      state.token = tokenValue
      Cookies.set('token',tokenValue)
      Cookies.set('tokenData',val)
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      Cookies.remove('token')
    },
    GET_TOKEN(state) {
      state.token = state.token || Cookies.get('token');
    }
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
    GetToken({ commit }){
      commit('GET_TOKEN',this)
    }
  }
}

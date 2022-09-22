import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import tab from './tab'

import getters from "./getters";

Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//   },
//   getters: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })

// 创建一个新的 store 实例
export default new Vuex.Store({
  modules: {
    user,tab
  },
  getters
})

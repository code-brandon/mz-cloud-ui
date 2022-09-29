import Cookies from 'js-cookie'
import {getMenuTree} from '@/api/menu.js';

export default {
  state: {
    isCollapse: false,
    // 面包屑 路由数据
    tabsList:[
      {
        path: '/home',
        name: 'Home',
        title: '首页',
        icon: 'home'
      }
    ],
    // 当前菜单
    currentMenu: null,
    // 登陆后后台获取的菜单
    menus:[]
  },
  mutations: {
    collapseMenu(state){
      state.isCollapse = !state.isCollapse
    },
    selectMenu: function (state, val) {
      if (val.name !== 'home') {
        state.currentMenu = val;
        // 从 路由数据 中查找索引（是否存在）
        const result = state.tabsList.findIndex(item => item.name === val.name);
        if (result === -1) {
          // 不存在 添加数据
          state.tabsList.push(val)
        }
      } else {
        state.currentMenu = null
      }
    },
    closeTag(state,val){
      const result = state.tabsList.findIndex(item=>item.name === val.name)
      state.tabsList.splice(result,1)
    },
    SET_MENU(state,val){
      state.menus = val;
      Cookies.set('menus', JSON.stringify(val));
    },
    GET_MENU(state) {
      console.log(!Cookies.get('menus'),Cookies.get('menus'))
      state.menus = state.menus || Cookies.get('menus') || [];
    },
    clearMenu(state){
      state.menus = [];
      Cookies.remove('menus');
    },
  },
  actions:{
    GetMenu({ commit }){
      commit('GET_MENU',this)
    },
    // 获取菜单
    MenuTree({ commit }) {
      return  new Promise((resolve, reject) => {
        getMenuTree().then(({data: res}) => {

          if (res.code != 0 ) {
            reject()
          }
          let menus = res.data
          commit('SET_MENU',menus)
          const menuArray = [];

          menus.forEach(item => {
            if (item.isFrame === 1) {
              let rous = {
                name: item.name,
                path: item.path,
                hidden: item.hidden,
                redirect: item.redirect,
                alwaysShow: item.alwaysShow,
                meta: item.meta,
                children: []
              }
              rous.component = () => item.component.toLowerCase() === 'layout' ? import('@/layout/Layout') : import(`views/pages/${item.component}`);
              if (item.children) {
                rous.children = item.children.map(item => {
                  let rous = {
                    name: item.name,
                    path: item.path,
                    hidden: item.hidden,
                    redirect: item.redirect,
                    component: null,
                    alwaysShow: item.alwaysShow,
                    meta: item.meta,
                    children: []
                  }
                  rous.component = () => item.component.toLowerCase() === 'layout' ? import('@/layout/Layout') : import(`views/pages/${item.component}`);
                  return rous;
                });
              }
              menuArray.push(rous);
            }
          });
          resolve(menuArray)
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


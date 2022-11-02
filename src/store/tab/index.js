import Cookies from 'js-cookie'
import {isURL} from 'utils/mz-utils.js'
import {getUserMenuTree} from '@/api/system/menu.js';

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
      console.log(state.menus || (Cookies.get('menus')|| []))
      state.menus = state.menus || (Cookies.get('menus')|| []);
    },
    CLEAR_MENU(state){
      state.menus = [];
      Cookies.remove('menus');
    },
  },
  actions:{
    GetMenu({ commit }){
      commit('GET_MENU',this)
    },
    // 获取菜单
    UserMenuTree({ commit }) {
      return  new Promise((resolve, reject) => {
        getUserMenuTree().then(({data: res}) => {

          if (res.code != 0 ) {
            reject()
          }
          let menus = res.data
          commit('SET_MENU',menus)
          const menuArray = [];

          // menus.forEach(item => {
          //   if (!isURL(item.path )) {
          //     let rous = {
          //       name: item.name,
          //       path: item.path,
          //       hidden: item.hidden,
          //       redirect: item.redirect,
          //       alwaysShow: item.alwaysShow,
          //       meta: item.meta,
          //       children: []
          //     }
          //     rous.component = () => item.component.toLowerCase() === 'layout' ? import('@/layout/Layout').default : import(`views/pages/${item.component}`).default;
          //     if (item.children) {
          //       rous.children = filterMenus(item.children)
          //     }
          //     menuArray.push(rous);
          //   }
          // });
          menuArray.push(...filterMenus(menus))
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

function filterMenus(item) {
  let arr = item.filter(to => {
    return !to.hidden;
  }).map(to => {
    let rous = {
      name: to.name,
      path: to.path,
      hidden: to.hidden,
      redirect: to.redirect,
      component: null,
      alwaysShow: to.alwaysShow,
      meta: to.meta,
      children: []
    }
    rous.component = () => to.component.toLowerCase() === 'layout' ? import('@/layout/Layout') : import(`@/views/pages/${to.component}`);
    if (to.children && to.children.length > 0) {
      rous.children = filterMenus(to.children);
    }
    return rous;
  })
  return arr;
}

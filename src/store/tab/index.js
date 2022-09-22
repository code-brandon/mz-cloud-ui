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
        label: '首页',
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
    setMenu(state,val){
      state.menus = val;
      Cookies.set('menus', JSON.stringify(val));
    },
    clearMenu(state){
      state.menus = [];
      Cookies.remove('menus');
    },
  },
  actions:{
    // 获取菜单
    MenuTree({ commit }) {
      return  new Promise((resolve, reject) => {
        getMenuTree().then(({data: res}) => {

          if (res.code != 0 ) {
            reject()
          }
          let menus = res.data
          console.log(menus)
          commit('setMenu',menus)
          const menuArray = [];

          menus.forEach(item => {
            let tempMenu = {
              path: item.path,
              name: item.name,
              meta: { title: item.name},
            }
            if (item.children) {
              item.children = item.children.map(item => {
                item.component = () => import(`views/${item.component}`)
                return item;
              });
              menuArray.push(...item.children);
            } else {
              item.component = () => import(`views/${item.url}`);
              menuArray.push(item);
            }
            menuArray.push();
          });


          menus.forEach(item => {
            menuNew.name = item.name
            menuNew.path = item.path
            menuNew.meta.title = item.name
            if (item.children) {
              item.children = item.children.map(item => {
                item.component = () => import(`views/${item.url}`)
                return item;
              });
              menuArray.push(...item.children);
            } else {
              item.component = () => import(`views/${item.url}`);
              menuArray.push(item);
            }
          });
          console.log(menuArray);
          // 路由的动态添加
          // menuArray.forEach(item => {
          //   // console.log( item);
          //   // 更换router的版本为"vue-router":"^3.5.3"
          //   vueRouter.addRoute('Main', item)
          // })
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


import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Config from '@/config/ENV.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    meta:{title:'首页',},
    component: () => import(/* webpackChunkName: "index" */ '../layout/Layout'),
    children: [],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "index" */ '../views/pages/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash', //history
  base: process.env.NODE_ENV === "development" ? Config.publicPath.dev : Config.publicPath.pro, // 与vue.config.js 的 publicPath 一致
  routes
})


// 白名单
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

// 导航守卫逻辑 from:从何处来，to:到哪里
router.beforeEach((to, from, next) => {
  console.log("触发路由守卫",to, from)
  store.dispatch("GetToken")
  store.dispatch("GetMenu")

  let token = store.getters.token;

  console.log("Token状态：",!!token)

  if (!!token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      console.log("是否有菜单信息：",store.getters.menus.length === 0,store.getters.menus)
      if (store.getters.menus.length === 0) {
        console.log("拉取用户信息")
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then((res) => {
          if (res.code === 0) {
            store.dispatch('UserMenuTree').then((accessRoutes) => {
              if (accessRoutes.length > 0) {
                // 根据roles权限生成可访问的路由表
                router.addRoutes(accessRoutes); // 动态添加可访问路由表
              }
              console.log(router.getRoutes(), accessRoutes)
              next({...to, replace: true}) // hack方法 确保addRoutes已完成
            }).catch(err => {
              console.error(err)
              store.dispatch("UserCLear")
            });
          }
        }).catch(err => {
          store.commit('CLEAR_TOKEN')
          /*store.dispatch('LogOut').then(() => {
            next({ path: '/' })
          }).catch(err => {
            console.error(err)
          })*/
        });
      } else {
        next()
      }
    }
  } else {
    // 没有token
    console.log(whiteList.indexOf(to.path))
    if (whiteList.indexOf(to.path) !== -1) {
      console.log("前往：", to.path);
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
});


//保存下来push方法 将来我们还会用到原push方法进行路由跳转
let originPush = VueRouter.prototype.push;

//接下来我们重写push|replace方法
//第一个参数location参数像原push方法声明跳转的地方 resolve和reject传递成功与失败

VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    //如果成功 调用原来的push方法
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(this, location, () => {}, () => {});
  }
}


export default router;

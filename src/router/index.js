import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "index" */ '../layout/Layout'),
    children: [
      /*{
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: '/',
        component: () => import(/!* webpackChunkName: "index" *!/ '../views/pages/admin/User.vue'),
      },*/
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "index" */ '../views/pages/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


// 白名单
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']


// 导航守卫逻辑 from:从何处来，to:到哪里
router.beforeEach((to, from, next) => {
  store.dispatch("GetToken")

  let token = store.getters.token;
  console.log(token);
  /*if (!!token) {
    /!* has token*!/
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.menus.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          store.dispatch('MenuTree').then(() => {
            // 根据roles权限生成可访问的路由表

            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }*/
  console.log('校验码后放行')
  next();
});

export default router

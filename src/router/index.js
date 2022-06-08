import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "index" */ '../views/pages/Main.vue'),
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: '/',
        component: () => import(/* webpackChunkName: "index" */ '../views/pages/admin/Blog.vue'),
      },
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


// 导航守卫逻辑 from:从何处来，to:到哪里
router.beforeEach((to, from, next) => {
  store.dispatch("GetToken")
  console.log(to, from);
  let pathStr = to.path.split('/');
  console.log(pathStr)
  let token = store.getters.token;
  console.log(token);
  console.log('校验码后放行')
  next();
});

export default router

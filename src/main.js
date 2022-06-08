import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import Axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css';

import "hover.css";
import './assets/comm-less/index.less'

// import thljs from 'highlight.js';

// import 'highlight.js/styles/atom-one-dark.css' //样式

//国际化 默认是引用的
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/zh-cn' // import locale

// Vue页面过渡
import VuePageTransition from 'vue-page-transition'

// 带动画的“喜欢”按钮
import VueStar from 'vue-star'

// 轻型表情符号选择器 https://github.com/joaoeudes7/V-Emoji-Picker
import VEmojiPicker from 'v-emoji-picker';

// 交互式动画 https://www.aminerman.com/kinesis/?from=madewith.cn#/
import { KinesisContainer, KinesisElement} from 'vue-kinesis'
import VueKinesis from "vue-kinesis";

// 页面滚动进度条插件  https://github.com/spemer/vue-scroll-progress
// import VueScrollProgress from 'vue-scroll-progress'
// Vue.use(VueScrollProgress)

//https://github.com/scaccogatto/vue-waypoint/tree/vue2
import VueWaypoint from 'vue-waypoint'

// Waypoint plugin
Vue.use(VueWaypoint)

Vue.use(VueKinesis);

Vue.use(VEmojiPicker);

Vue.component('VueStar', VueStar)

Vue.prototype.$http = Axios;

Vue.prototype.$OkCode = 0;

Vue.use(VuePageTransition)

// 引入NProgress进度条
/*import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 全局使用NProgress
router.beforeEach((to,from,next)=>{
    NProgress.start()
    next()
})
router.afterEach(()=>{
    NProgress.done()
})*/

dayjs.extend(isLeapYear) // use plugin
dayjs.locale('zh-cn') // use locale

Vue.config.productionTip = false

Vue.use(VueI18n);
Vue.use(ElementUI);

Vue.use("https://cdn.jsdelivr.net/npm/spacingjs");

Vue.config.lang = 'zh-cn'
Vue.locale('zh-cn', zhLocale)
Vue.locale('en', enLocale)

// Vue.directive('highlight',function(el){
//     hljs.configure({useBR: true});
//     let blocks = el.querySelectorAll('pre code');
//     blocks.forEach((block)=>{
//         hljs.highlightBlock(block)
//     })
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

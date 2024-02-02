export default {
    state: {
        captchaId:''
    },
    mutations: {
        SET_CAPTCHA_ID(state,val){
            state.captchaId=val
        },
    },
    actions:{
        CLEAR_CAPTCHA_ID({commit}){
            commit('SET_CAPTCHA_ID', '')
        },
    }
  }
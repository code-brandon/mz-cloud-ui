const getters = {
  token: state => state.user.token,
  menus: status => status.tab.menus,
  tabsList: status => status.tab.tabsList,
  user: status => status.user.user,
  auth: status => status.user.auth,
  captchaId:status => status.captcha.captchaId,
}
export default getters

const getters = {
  token: state => state.user.token,
  menus: status => status.tab.menus,
  user: status => status.user.user,
  auth: status => status.user.auth,
}
export default getters

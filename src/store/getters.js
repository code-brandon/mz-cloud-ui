const getters = {
  token: state => state.user.token,
  menus: status => status.tab.menus,
  user: status => status.user.user,
}
export default getters

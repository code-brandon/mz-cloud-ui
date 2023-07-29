import store from '@/store'
export function isAuth(key) {
  let auths = store.getters.auth;
  for (const authsKey of auths) {
    // debugger
    if (authsKey.authority === '*:*:*') {
      return true
    }
    if (key && authsKey.authority === key) {
      return true
    }
    if (key && authsKey.authority === "ROLE_".concat(key)) {
      return true
    }
  }
  return false
}

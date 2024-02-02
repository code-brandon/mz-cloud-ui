import axios from '@/config/request.js'

export const gen = () => {
  return axios.request({
    url: '/api/auth/captcha/gen',
    method: 'GET',
    headers: {
      isToken: false,
    },
  },{
    successShow: false
  })
}

export const check = (id, data) => {
  return axios.request({
    url: `/api/auth/captcha/check?id=${id}`,
    method: 'POST',
    headers: {
      isToken: false,
    },
    data,
  },{
    successShow: false
  })
}

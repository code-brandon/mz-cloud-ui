import axios from '@/config/request.js'

export const gen = () => {
  return axios.request({
    url: '/captcha/gen',
    method: 'GET',
    headers: {
      isToken: false,
    },
  })
}

export const check = (id, data) => {
  return axios.request({
    url: `/captcha/check?id=${id}`,
    method: 'POST',
    headers: {
      isToken: false,
    },
    data,
  })
}

import axios from '../../assets/js/axios'
import path from '../../assets/js/path'
export function phoneLogin(phone, password) {
  return axios.get(path.user.phoneLogin, {
    params: {
      phone,
      password
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}

export function emailLogin(email, password) {
  email += '@163.com'
  return axios.get(path.user.emailLogin, {
    params: {
      email,
      password
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}

export function logout() {
  return axios.get(path.user.logout).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function verifyCode(phone, captcha) {
  return axios.get(path.user.verifyCode, {
    params: {
      phone,
      captcha
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}

export function getCode(phone) {
  return axios.get(path.user.getCode, {
    params: {
      phone
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}

export function registerPhone(phone, password, captcha) {
  return axios.get(path.user.registerPhone, {
    params: {
      phone,
      password,
      captcha
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}

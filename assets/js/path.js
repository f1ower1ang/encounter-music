const prefix = 'http://encounter-music.cn:8080'
export default {
  user: {
    phoneLogin: prefix + '/login/cellphone',
    emailLogin: prefix + '/login',
    logout: prefix + '/logout',
    verifyCode: prefix + '/captcha/verify',
    getCode: prefix + '/captcha/sent',
    registerPhone: prefix + '/register/cellphone'
  }
}

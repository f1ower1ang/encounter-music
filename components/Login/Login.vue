<template>
  <div v-show="showWrapper" class="login-wrapper">
    <div class="header">
      <p class="title">
        {{ current }}
      </p>
      <p class="close" title="关闭窗体" @click="hidden">
        ×
      </p>
    </div>
    <div v-show="current === '登录'" class="index">
      <div class="body">
        <div class="left">
          <div class="plt" />
          <el-button type="primary" @click="changeBox('手机号登录')">
            手机号登录
          </el-button>
          <el-button @click="changeBox('手机号注册')">
            注册
          </el-button>
        </div>
        <div class="right">
          <ul>
            <li>
              <a
                href="https://music.163.com/api/sns/authorize?snsType=10&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                target="_blank"
                title="微信登录"
              >
                <i class="icon icon-wechart" />
              </a>
            </li>
            <li>
              <a
                href="https://music.163.com/api/sns/authorize?snsType=5&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                target="_blank"
                title="QQ登录"
              >
                <i class="icon icon-qq" />
              </a>
            </li>
            <li>
              <a
                href="https://music.163.com/api/sns/authorize?snsType=2&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                target="_blank"
                title="微博登录"
              >
                <i class="icon icon-weblog" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                title="163邮箱登录"
                @click="changeBox('邮箱登录')"
              >
                <i class="icon icon-email" style="font-size: 24px" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-show="current === '手机号注册'" class="register">
      <el-form v-show="flag && !user" ref="registerForm" class="body" :model="registerForm" :rules="registerRules">
        <el-form-item style="margin-bottom: 10px" prop="phone">
          <label>手机号：</label>
          <el-input v-model="registerForm.phone" placeholder="请输入手机号">
            <template slot="prepend">
              +86
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px" prop="password">
          <label>密码：</label>
          <el-input v-model="registerForm.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="register_phone('registerForm')">
            下一步
          </el-button>
        </el-form-item>
      </el-form>
      <div v-show="!flag && !user" class="body" style="font-size: 12px">
        <div style="padding-bottom: 20px">
          <p style="color: #bbb">
            你的手机号：<strong style="color: #eee">+<span class="js-code">86</span>&nbsp;<span class="js-mob">{{ filteredPhone }}</span></strong>
          </p>
          <p style="margin-top: 5px; color: #888">
            为了安全，我们会给你发送短信验证码
          </p>
        </div>
        <div id="captcha-input">
          <div class="f-cb">
            <div class="u-word">
              <input
                ref="first"
                v-model="captcha[0]"
                maxlength="1"
                name="captcha"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              >
            </div>
            <div class="u-word">
              <input
                v-model="captcha[1]"
                maxlength="1"
                name="captcha"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              >
            </div>
            <div class="u-word">
              <input
                v-model="captcha[2]"
                maxlength="1"
                name="captcha"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              >
            </div>
            <div class="u-word">
              <input
                v-model="captcha[3]"
                maxlength="1"
                name="captcha"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              >
            </div>
          </div>
          <div class="send">
            <span v-show="!resend" class="js-cd u-btn u-btn2 f-hide">{{ time }}S</span>
            <a v-show="resend" href="#" class="js-send u-btn" @click="register_code"><i>重新发送</i></a>
          </div>
          <div v-show="errorCaptcha" class="u-err">
            <i class="icon icon-error" /><span>验证码错误</span>
          </div>
        </div>
        <el-button type="primary" style="margin-top: 20px" @click.native="verifyCode($event)">
          下一步
        </el-button>
      </div>
      <div v-if="user" class="body">
        <div style="line-height:22px; font-size: 14px; color: #ccc">
          该手机号已与云音乐帐号 <strong style="color: #fff">{{ user.nickname }}</strong> 绑定，<br><br>以后你可以直接用该手机号+密码登录
        </div>
        <el-button type="primary" style="margin-top: 20px" @click.native="hidden()">
          知道了
        </el-button>
      </div>
      <div class="footer">
        <a href="javascript:;" data-action="back" class="s-primary" @click="changeBox('登录')">&lt;&nbsp;&nbsp;返回登录</a>
      </div>
    </div>
    <div v-show="current === '手机号登录'" class="phone-login">
      <div class="body">
        <label>手机号：</label>
        <el-input v-model="login_phone" placeholder="请输入手机号">
          <template slot="prepend">
            +86
          </template>
        </el-input>
        <label>密码：</label>
        <el-input v-model="login_password" placeholder="请输入密码" show-password />
        <div v-show="errorAccount" class="u-err">
          <i class="icon icon-error" /><span>手机号或密码错误</span>
        </div>
        <el-button type="primary" @click="phoneLogin($event)">
          登录
        </el-button>
      </div>
      <div class="footer">
        <a href="javascript:;" class="s-primary" @click="changeBox('登录')">&lt;&nbsp;&nbsp;返回登录</a>
        <a href="javascript:;" @click="changeBox('手机号注册')">没有帐号？免费注册&nbsp;&nbsp;&gt;</a>
      </div>
    </div>
    <div v-show="current === '邮箱登录'" class="email-login">
      <div class="body">
        <el-input v-model="email" style="margin-bottom: 20px" placeholder="请输入账号">
          <template slot="append">
            @163.com
          </template>
        </el-input>
        <el-input v-model="password" placeholder="请输入密码" show-password />
        <div v-show="errorEmail" class="u-err">
          <i class="icon icon-error" /><span>帐号或密码错误</span>
        </div>
        <el-button type="primary" @click.native="emailLogin($event)">
          登录
        </el-button>
      </div>
      <div class="footer">
        <a href="javascript:;" class="s-primary" @click="changeBox('登录')">&lt;&nbsp;&nbsp;其他登录方式</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { phoneLogin, verifyCode, getCode, registerPhone, emailLogin } from '../../api/index/user'

export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value.length === 0) {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.indexOf(' ') > -1) {
        callback(new Error('密码不能包含空格'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度为6-16位'))
      } else {
        callback()
      }
    }
    return {
      current: '登录',
      login_phone: '',
      login_password: '',
      email: '',
      password: '',
      showWrapper: false,
      registerForm: {
        phone: '',
        password: ''
      },
      registerRules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'change' }
        ]
      },
      flag: true,
      errorCaptcha: false,
      errorAccount: false,
      errorEmail: false,
      resend: false,
      captcha: ['', '', '', ''],
      time: 60
    }
  },
  computed: {
    filteredPhone() {
      return this.registerForm.phone.substring(0, 3) + '****' + this.registerForm.phone.substring(7)
    },
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    const that = this
    const input = document.getElementsByName('captcha')
    for (let i in input) {
      if (i !== 'length') {
        input[i].onkeyup = function (e) {
          i = parseInt(i)
          if (e.keyCode === 8 && i !== 0) {
            input[i - 1].focus()
          } else if (this.value.length === 1) {
            if (i !== 3) {
              input[i + 1].focus()
            } else {
              that.verifyCode()
            }
          }
        }
      }
    }
  },
  methods: {
    changeBox(current) {
      this.current = current
    },
    emailLogin(e) {
      e.target.disabled = true
      e.target.innerText = '正在登录...'
      emailLogin(this.email, this.password).then((res) => {
        if (res.code === 200) {
          this.errorEmail = false
          const user = {
            userId: res.profile.userId,
            nickname: res.profile.nickname,
            avatar: res.profile.avatarUrl
          }
          setTimeout(() => {
            e.target.disabled = false
            e.target.innerText = '登录'
            this.setUser(user)
          }, 1000)
        }
      }).catch(() => {
        e.target.disabled = false
        e.target.innerText = '登录'
        this.errorEmail = true
      })
    },
    phoneLogin(e) {
      e.target.disabled = true
      e.target.innerText = '正在登录...'
      phoneLogin(this.login_phone, this.login_password).then((res) => {
        if (res.code === 200) {
          this.errorAccount = false
          const user = {
            userId: res.profile.userId,
            nickname: res.profile.nickname,
            avatar: res.profile.avatarUrl
          }
          setTimeout(() => {
            e.target.disabled = false
            e.target.innerText = '登录'
            this.setUser(user)
          }, 1000)
        }
      }).catch(() => {
        e.target.disabled = false
        e.target.innerText = '登录'
        this.errorAccount = true
      })
    },
    register_phone(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.flag = false
          that.register_code()
          setTimeout(() => {
            that.$refs.first.focus()
          }, 200)
        } else {
          return false
        }
      })
    },
    register_code() {
      getCode(this.registerForm.phone).then((res) => {
        this.time = 60
        this.resend = false
        if (this.time === 60) {
          this.timer = setInterval(() => {
            if (this.time === 0) {
              this.resend = true
              clearInterval(this.timer)
            }
            this.time--
          }, 1000)
        }
      })
    },
    verifyCode(e) {
      if (e) {
        e.target.innerText = '正在验证...'
        e.target.disabled = true
        this.errorCaptcha = false
      }
      verifyCode(this.registerForm.phone, this.captcha.join('')).then(() => {
        if (e) {
          e.target.innerText = '下一步'
          e.target.disabled = false
        }
        registerPhone(this.registerForm.phone, this.registerForm.password, this.captcha.join('')).then((res) => {
          if (res.code === 200) {
            const user = {
              userId: res.profile.userId,
              nickname: res.profile.nickname,
              avatar: res.profile.avatarUrl
            }
            this.setUser(user)
          }
        }).catch(() => {
          this.errorCaptcha = true
        })
      }).catch(() => {
        if (e) {
          setTimeout(() => {
            e.target.innerText = '下一步'
            e.target.disabled = false
            this.errorCaptcha = true
          }, 1000)
        } else {
          this.errorCaptcha = true
        }
      })
    },
    hidden() {
      this.showWrapper = false
    },
    show() {
      this.showWrapper = true
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  }
}
</script>

<style scoped lang="stylus" style="margin-bottom: 0">
  .login-wrapper
    border-radius: 4px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);
    border: none;
    width 450px
    position fixed
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    background #2c3a47

    .header
      margin: 0;
      height: 38px;
      line-height: 38px;
      padding: 0 18px
      border-radius: 3px 3px 0 0;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
      background-color rgb(45, 45, 45)
      display flex
      justify-content space-between

      .close
        color: rgba(255, 255, 255, .8)
        padding 0 5px

    .index
      padding: 40px 0 39px;

      .body
        display flex

        .left
          padding 0 35px 3px 40px
          border-right 1px dotted #ccc
          width 250px

          .plt
            height: 120px;
            background url("https://s2.music.126.net/style/web2/img/platform.png?1eff6340ed1a7e4e5cdac174db15fd0f") no-repeat 13px 0

          .el-button
            width 100%
            margin 10px 0 0 0
            line-height 31px
            padding 0

        .right
          padding: 3px 0 3px 39px;
          margin-top: -15px;

          li
            margin-top 15px

            a
              position: relative
              color: #333;
              line-height: 40px;
              display block
              width 40px
              height 40px
              border-radius 50%
              text-align center
              background: #2c3a47;
              transition: 0.3s;

              &:hover
                text-shadow 0 0 4px #25ccf7

                &:before
                  box-shadow: 0 0 14px 2px #25ccf7;
                  transform: scale(1.05);

              &:before
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                border-radius: 50%;
                background: #25ccf7;
                transition: 0.6s;
                transform: scale(0.8);
                z-index: -1;

              .icon
                padding 0
                font-size 25px
                color #fff

      .footer
        white-space: nowrap;
        margin-left: 40px;
        margin-top: 30px;
        font-family: NotoSansHans-Regular;
        font-size: 10px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 15px;

    .register, .phone-login, .email-login
      .body
        padding: 30px 0 43px;
        width: 220px;
        margin: 0 auto;

        label
          color: #666;
          font-size 12px
          line-height 30px

        .el-button
          width 100%
          margin-top 20px
          line-height 30px
          padding 0
          margin-left 0

      .footer
        padding: 0 19px;
        height: 48px;
        font-size 12px
        border-top: 1px solid #c6c6c6;
        border-radius: 0 0 4px 4px;
        line-height: 48px;
        background-color: #384958;
        display flex
        justify-content space-between

        a
          color #eee

        .s-primary
          color #25ccf7

    .register
      #captcha-input
        .f-cb
          .u-word
            position: relative;
            width: 50px;
            float: left;
            margin-right: 5px;

            &:before
              content: '';
              position: absolute;
              bottom: 0;
              width: 50px;
              height: 2px;
              background-color: rgba(0, 0, 0, 0.4);

            input
              width: 24px;
              margin: 0 13px;
              border: none;
              font-size: 24px;
              height: 19px;
              border-radius: 2px;
              line-height: 19px;
              padding 5px 6px 6px
              color: #fff;
              outline none
              background: transparent;

          &:after
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;

        .send
          line-height 18px
          padding-top 5px

          .u-btn
            float right
            color: #0C73C2;

    .u-err
      padding-top 5px
      height: auto;
      line-height: 20px;
      color #e33232
      font-size 14px

</style>

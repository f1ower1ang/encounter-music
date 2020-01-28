<template>
  <div class="side-bar">
    <div class="logo">
      <div class="img">
        <img :src="imgUrl" id="img">
        <div v-if="user !== null" class="introduction">
          <el-card>
            <h1 class="title">
              <img :src="imgUrl" alt="" height="70">{{ user.nickname }}
            </h1>
            <div class="footer">
              <a class="left">
                个人主页
              </a>
              <a class="right" @click.prevent="logout">
                退出
              </a>
            </div>
          </el-card>
        </div>
      </div>
      <span class="username" @click="showLogin">
        {{ username }}
      </span>
    </div>
    <dl v-for="(li,index) in list" :key="index" class="list">
      <dt class="title">
        {{ li.title }}
      </dt>
      <dd
        v-for="(item, idx) in li.items"
        :key="idx"
        class="icon"
        :class="{current: currentRouter === item.router}"
        @click="selectItem(item)"
      >
        <i :class="item.icon" />
        <p>
          {{ item.content }}
        </p>
      </dd>
    </dl>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { logout } from '../../api/index/user'

export default {
  name: 'SideBar',
  data() {
    return {
      list: [
        {
          title: '在线音乐',
          items: [
            {
              icon: 'icon-music',
              content: '音乐馆',
              router: '/'
            }
          ]
        },
        {
          title: '我的音乐',
          items: [
            {
              icon: 'icon-not-favorite',
              content: '我喜欢',
              router: '/favorite'
            },
            {
              icon: 'icon-history',
              content: '播放历史',
              router: '/history'
            }
          ]
        }
      ],
      currentRouter: ['/', '/singer', '/disc', '/rank'].indexOf(this.$route.path) === -1 ? this.$route.path : '/'
    }
  },
  computed: {
    imgUrl() {
      return !this.user ? '/_nuxt/assets/image/default.png' : this.user.avatar
    },
    username() {
      return !this.user ? '登录遇见音乐' : this.user.nickname
    },
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    currentPath(newPath) {
      const path = ['/', '/singer', '/disc', '/rank']
      if (path.indexOf(newPath) !== -1) {
        this.currentRouter = '/'
      } else {
        this.currentRouter = newPath
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    showLogin() {
      if (!this.user) {
        this.$emit('show')
      }
    },
    selectItem(item) {
      this.currentRouter = item.router
      this.$router.push(item.router)
    },
    logout() {
      logout().then((res) => {
        if (res.code === 200) {
          this.setUser(null)
        }
      })
    },
    ...mapMutations({
      setUser: 'SET_USER'
    }),
    ...mapActions([
      'getUser'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .side-bar
    background $color-background
    width 200px
    height 100%

    .logo
      width 100%
      padding-top 10px
      display flex
      align-items center

      .img
        position relative
        padding-bottom 5px

        #img
          margin-left 20px
          width 50px
          height 50px
          border-radius 50%
          border 1px dotted #000

        &:hover
          .introduction
            display block

        .introduction
          z-index 100
          position absolute
          left 5px
          width 300px
          top 100%
          display none
          .title
            font-size $font-size-large
            color $color-text
            img
              border-radius 50%
          .footer
            margin-top 20px
            border-top 1px solid #eee
            display flex
            a
              line-height 30px
              margin-top 5px
              text-align center
              flex 1
              font-size $font-size-medium
              cursor: pointer;
              transition all .2s
              &:hover
                color $color-theme
            .left
              border-right 1px solid #eee

      .username
        vertical-align middle
        padding-left 5px
        font-size 13px
        color rgba(255, 255, 255, .7)

      img:hover, .username:hover
        cursor pointer

    .list
      margin-top 10px

      .title
        padding 0 15px
        margin 10px 10px 0 5px
        height 30px
        line-height 30px
        font-size $font-size-small
        color $color-text-d

      .icon
        display flex
        padding 0 15px
        height 30px
        margin 10px 10px 0 5px
        font-size $font-size-medium-x
        color $color-text-l
        align-items center
        transition all .2s

        i
          flex 0 0 20px
          margin-right 5px

        p
          flex 1
          font-size $font-size-medium

        &:hover
          background $color-border
          cursor pointer

        &.current
          background $color-background-l
</style>

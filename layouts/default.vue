<template>
  <div class="encounter-music">
    <div ref="sideBar" class="side-bar-wrapper">
      <side-bar @show="showLogin"/>
    </div>
    <div class="content-wrapper">
      <el-row class="content-top">
        <i style="font-size: 20px" class="icon el-icon-arrow-left" @click="back" />
        <div class="search-wrapper">
          <search-box ref="searchBox" @hidden="hiddenAll" @query="suggest" @search="search" />
        </div>
      </el-row>
      <hot-key v-show="show1 && flag" @select="selectKey" />
      <suggest v-show="show2 && flag" :query="query" @select="setQuery" />
      <div ref="content" class="page-content">
        <nuxt keep-alive />
      </div>
    </div>
    <message />
    <player />
    <login v-if="!user" ref="login" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Player from '../components/Player/Player'
import SideBar from '../components/SideBar/SideBar'
import SearchBox from '../components/SearchBox/SearchBox'
import HotKey from '../components/hotKey/hotKey'
import suggest from '../components/suggest/suggest'
import message from '../components/message/message'
import Login from '../components/Login/Login'
import { playListMixin } from '../assets/js/mixin'

export default {
  components: { Player, SideBar, SearchBox, HotKey, suggest, message, Login },
  mixins: [playListMixin],
  data() {
    return {
      show1: false,
      show2: false,
      flag: false,
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    showLogin() {
      this.$refs.login.show()
    },
    handlePlayList(playList) {
      const bottom = playList && playList.length > 0 ? '60px' : 0
      this.$refs.content.style.bottom = bottom
      this.$refs.sideBar.style.bottom = bottom
    },
    back() {
      this.$router.back()
    },
    setQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    selectKey(k) {
      this.$refs.searchBox.setQuery(k)
    },
    search(e, query) {
      if (e.keyCode === 13) {
        this.$router.push(`/search?keywords=${query}`)
        this.flag = false
      }
    },
    suggest(query, blur) {
      if (blur) {
        this.flag = true
      }
      this.query = query
      if (query.length > 0) {
        this.show1 = false
        this.show2 = true
      } else {
        this.show1 = true
        this.show2 = false
      }
    },
    hiddenAll() {
      setTimeout(() => {
        this.flag = false
      }, 250)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/stylus/variable.styl"
  .encounter-music
    position absolute
    color $color-text-l
    top 0
    left 0
    width 100%
    height 100%
    background-size cover
    background-position center
    background linear-gradient(160deg, #606060, #90A8A8 20%, #306078 60%, #7890A8 100%)

    .side-bar-wrapper
      position absolute
      width 200px
      top 0
      bottom 0

    .content-wrapper
      position absolute
      left 200px
      right 0
      top 0
      bottom 0

      .content-top
        position fixed
        left 200px
        right 0
        display flex
        align-items center
        z-index 2
        height 60px
        background $color-background-l

        .icon
          padding-left 20px
          width 30px
          line-height 30px
          height 30px
          transition all .2s

          &:hover
            color $color-theme
            cursor pointer

        .search-wrapper
          margin auto
          width 40%
          margin-top 10px
          margin-bottom 10px

      .page-content
        position absolute
        top 60px
        left 0
        right 0
        bottom 0
        overflow hidden
</style>

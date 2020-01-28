<template>
  <transition name="slide">
    <div v-show="flag" class="playlist" @click="hidden">
      <div class="playlist-wrapper" @click.stop="hiddenMenu">
        <div class="top">
          <p class="title">
            播放列表
          </p>
          <el-row class="option">
            <el-col :span="9">
              {{ playList.length }}首歌曲
            </el-col>
            <el-col :span="9">
              <i class="icon-option" />
              批量操作
            </el-col>
            <el-col :span="6" @click.native="clear">
              <i class="el-icon-delete" />
              清空
            </el-col>
          </el-row>
        </div>
        <div class="wrapper">
          <ul class="list" @scroll="hiddenMenu">
            <li
              v-for="(song, index) in playList"
              :key="index"
              class="item"
              :class="{current: index === currentIndex || num === index}"
              @dblclick="playSong(index)"
              @click="addCurrent(index, song)"
            >
              <div class="left">
                <p class="song" v-html="song.name" />
                <p class="info">
                  <span class="album" v-html="song.album.name" />
                  <span class="time">
                    {{ format(song.interval) }}
                  </span>
                </p>
              </div>
              <div class="right">
                <i class="icon" :class="index === currentIndex && playing ? 'icon-mini-pause' : 'icon-mini-play'" @click="playSong(index)" @dblclick.stop />
                <i class="icon" :class="getFavIcon(song)" @click="toggleFavorite(song, index)" @dblclick.stop />
                <i class="icon-menu icon" style="padding-right: 0" @click.stop="showMenu($event, song, index)" @dblclick.stop />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Menu ref="menu" :song="curSong" :favor="fav" :show-del="true" :show-add="false" />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { loadFavorite, saveFavorite, deleteFavorite } from '../../assets/js/cache'
import Menu from '../Menu/Menu'

export default {
  name: 'Playlist',
  components: { Menu },
  data() {
    return {
      flag: false,
      num: -1,
      curSong: null,
      fav: false
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'playing',
      'favoriteList',
      'currentIndex'
    ])
  },
  mounted() {
    this.setFavoriteList(loadFavorite())
    this.toggleFavorite = function (song) {
      if (this.isFavorite(song)) {
        this.setFavoriteList(deleteFavorite(song))
      } else {
        this.setFavoriteList(saveFavorite(song))
      }
      this.$refs.menu.hidden()
    }
  },
  methods: {
    show() {
      this.flag = true
    },
    hidden() {
      this.num = -1
      this.flag = false
    },
    addCurrent(index, song) {
      this.num = index
      this.curSong = song
      this.$refs.menu.hidden()
      this.fav = this.favoriteList.findIndex((s) => { return s.songId === song.songId }) !== -1
    },
    showMenu(e, song, index) {
      this.$refs.menu.show()
      this.curSong = song
      if (e.clientY > window.innerHeight / 2) {
        this.$refs.menu.$el.style.top = ''
        this.$refs.menu.$el.style.bottom = `${window.innerHeight - e.clientY}px`
      } else {
        this.$refs.menu.$el.style.top = `${e.clientY}px`
        this.$refs.menu.$el.style.bottom = ''
      }
      this.$refs.menu.$el.style.right = `${window.innerWidth - e.clientX}px`
      this.fav = this.favoriteList.findIndex((s) => { return s.songId === song.songId }) !== -1
      this.num = index
    },
    hiddenMenu() {
      this.$refs.menu.hidden()
    },
    clear() {
      this.clearPlaylist()
      this.hidden()
      this.$refs.menu.hidden()
    },
    playSong(index) {
      if (index === this.currentIndex) {
        this.setPlaying(!this.playing)
      } else {
        this.setCurrentIndex(index)
        this.setPlaying(true)
      }
      this.$refs.menu.hidden()
    },
    isFavorite(song) {
      return this.favoriteList.findIndex(item => song.songId === item.songId) !== -1
    },
    getFavIcon(song) {
      return this.favoriteList.findIndex((s) => {
        return song.songId === s.songId
      }) !== -1 ? 'icon-favorite' : 'icon-not-favorite'
    },
    format(interval) { // 格式化歌曲播放时间
      interval = interval | 0

      const minute = this._pad(interval / 60 | 0)

      const second = this._pad(interval % 60)

      return `${minute}:${second}`
    },
    _pad(num, n = 2) { // 位数不够添0
      let len = num.toString().length
      if (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaying: 'SET_PLAYING',
      setFavoriteList: 'SET_FAVORITE_LIST'
    }),
    ...mapActions([
      'clearPlaylist'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
  .playlist
    bottom 61px
    position fixed
    right 0
    top 0
    left 0
    z-index 100
    color $color-text
    .playlist-wrapper
      box-shadow -1px 0 5px 1px #ccc
      position absolute
      right 0
      top 0
      width 300px
      height 100%
      background #fff
      display flex
      flex-direction column
      .top
        height 70px
        width 100%
        box-sizing border-box
        flex 0 0 70px
        padding-left 20px
        background #f9f9f9
        .title
          padding-top 10px
          line-height 30px
          font-size $font-size-medium-x
        .option
          line-height 20px
          font-size $font-size-small
      .wrapper
        overflow: hidden
        flex 1
        .list
          height 100%
          overflow auto
          width 100%
          .item
            width 100%
            border-top 1px solid #efefef
            height 60px
            display flex
            padding 0 20px
            box-sizing border-box
            align-items center
            &.current
              background #f8f8f8
              .song, .album
                color $color-theme
              .time
                display none
              .right
                display block
            .left
              flex 2
              display flex
              flex-direction column
              align-content center
              width 100%
              no-wrap()
              .song
                line-height 30px
                font-size 13px
                width 80%
                no-wrap()
              .info
                line-height 15px
                font-size $font-size-small
                display flex
                no-wrap()
                .album
                  flex 3
                  no-wrap()
                .time
                  flex 1
                  text-align right
                  color $color-text-d
            .right
              flex 1
              display none
              text-align right
              width 100%
            &:hover
              background #f8f8f8
              .left
                .info
                  display block
                  .album
                    width 70%
                  .time
                    display none
              .right
                display block
    .icon-favorite
      color #ff6a6a
    .icon:hover
      color $color-theme
      cursor: pointer
      &.icon-favorite
        color #ff6a6a
    &.slide-enter-active, &.slide-leave-active
      transition all .4s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
</style>

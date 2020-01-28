<template>
  <div v-show="flag" class="menu" @click.stop>
    <p class="item" @click="playSong">
      <i class="icon-mini-play" />播放
    </p>
    <p v-show="showAdd" class="item" @click="addNext">
      <i class="icon-next-play" />下一首播放
    </p>
    <p class="item" :class="{ undo: favor }" @click="addToFavor">
      <i :class="favor ? 'icon-favorite' : 'icon-not-favorite'" />添加到我喜欢
    </p>
    <p v-show="showAdd" class="item" @click="addToPlaylist">
      <i class="icon-playlist" />添加到播放列表
    </p>
    <p class="item" @click="download">
      <i class="icon-download" />下载
    </p>
    <p v-show="showDel" class="item" @click="removeSong">
      <i class="el-icon-delete" style="padding-right: 5px" />删除
    </p>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { saveFavorite, deletePlayHistory } from '../../assets/js/cache'
export default {
  name: 'Menu',
  props: {
    favor: {
      type: Boolean,
      default: false
    },
    song: {
      type: Object,
      default: null
    },
    showDel: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: -1
    },
    songs: {
      type: Array,
      default: null
    },
    type: {
      default: 'playlist',
      type: String
    }
  },
  data() {
    return {
      flag: false
    }
  },
  computed: {
    singers() {
      return this.song.singer.map(s => s.name).join('/')
    },
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    download() {
      const that = this
      const url = this.song.url // 目标地址
      const filename = `${this.song.name} - ${this.singers}.mp3`
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onprogress = function (progress) {
        if (progress.total !== 0) {
          const percent = Math.floor(progress.loaded / progress.total * 10000)
          that.displayMsg({
            flag: true,
            msg: `正在下载：${percent / 100}%`
          })
        } else {
          this.setShowMsg(false)
          this.$message.error('当前歌曲无法下载')
        }
      }
      xhr.onloadstart = function () {
        that.displayMsg({
          flag: true,
          msg: `正在下载：0%`
        })
      }
      xhr.onload = function () {
        if ((this.status >= 200 && this.status < 300) || this.status === 304) {
          const blob = new Blob([this.response])
          const link = document.createElement('a')
          document.body.appendChild(link)
          link.style.display = 'none'
          const Url = URL.createObjectURL(blob)
          link.setAttribute('href', Url)
          link.setAttribute('download', filename)
          link.click()
          URL.revokeObjectURL(Url)
        }
      }
      xhr.open('get', url, true)
      xhr.send(null)
    },
    show() {
      this.flag = true
    },
    hidden() {
      this.flag = false
    },
    playSong() {
      if (this.showDel) {
        const index = this.playList.findIndex((s) => {
          return s.songId === this.song.songId
        })
        this.setCurrentIndex(index)
        this.setPlaying(true)
      } else {
        this.selectPlay({
          list: this.songs,
          index: this.index
        })
      }
      this.hidden()
    },
    removeSong() {
      if (this.type === 'playlist') {
        this.deleteSong(this.song)
      } else if (this.type === 'history') {
        this.setPlayHistory(deletePlayHistory(this.song))
      }
      this.hidden()
    },
    addToPlaylist() {
      this.addToQueue(this.song)
      this.hidden()
    },
    addToFavor() {
      if (this.favor) {
        this.hidden()
        return
      }
      this.setFavoriteList(saveFavorite(this.song))
      this.hidden()
    },
    addNext() {
      this.nextPlay(this.song)
      this.hidden()
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setFavoriteList: 'SET_FAVORITE_LIST',
      setPlayHistory: 'SET_PLAY_HISTORY',
      setShowMsg: 'SET_SHOW_MSG'
    }),
    ...mapActions([
      'deleteSong',
      'nextPlay',
      'addToQueue',
      'selectPlay',
      'displayMsg'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
  .menu
    padding 10px 0
    box-shadow 0 0 5px #ccc
    width 180px
    position fixed
    background #fff
    color $color-text
    .item
      padding 0 15px
      line-height 30px
      font-size $font-size-small
      width 150px
      &:hover
        background $color-border
        cursor pointer
      &.undo
        background #fff
        color #8c8c8c
        cursor not-allowed
        .icon-favorite
          color #ffb3b3
  [class^="icon-"]
    font-size $font-size-small
</style>

<template>
  <div v-show="playList.length > 0" class="player">
    <transition name="normal">
      <div
        v-show="fullScreen"
        ref="normal"
        class="normal"
        @click="closePlaylist"
      >
        <div class="background-mask" />
        <div class="background" :style="`background-image: url('${currentSong.imgUrl}')`" />
        <i class="el-icon-arrow-down" @click="exitFull" />
        <div v-if="currentSong" class="middle">
          <div class="album">
            <img :src="imgUrl" onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'" alt="">
          </div>
          <div class="info">
            <p class="title" v-html="currentSong.name" />
            <el-row class="desc">
              <el-col :span="8" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap">
                <span style="color: rgba(255, 255, 255, .6)">歌手：</span>
                <span v-for="(s, index) in currentSong.singer" :key="index" class="singer" style="padding-right: 5px" @click.stop="selectSinger(s)">
                  {{ s.name }}
                </span>
              </el-col>
              <el-col :span="12" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap">
                <span style="color: rgba(255, 255, 255, .6)">专辑：</span>
                <span class="album" @click="selectAlbum(currentSong.album)">
                  {{ currentSong.album && currentSong.album.name }}
                </span>
              </el-col>
            </el-row>
            <div class="lyric">
              <div class="container">
                <scroll
                  ref="lyricList"
                  :data="currentLyric && currentLyric.lines"
                  class="scroll"
                >
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p
                        v-for="(lyric, index) in currentLyric.lines"
                        :key="index"
                        ref="lyric"
                        class="text"
                        :class="{current: currentLineNumber === index}"
                        v-html="lyric.txt"
                      />
                    </div>
                    <p v-else class="single">
                      {{ singleLyric }}
                    </p>
                  </div>
                </scroll>
              </div>
            </div>
          </div>
        </div>
        <div class="time">
          <p class="left">
            {{ format(currentTime) }}
          </p>
          <p class="right">
            {{ format(currentSong.interval) }}
          </p>
        </div>
        <div class="options">
          <process-bar :percent="percent" @progressChange="changeTime" />
          <div class="left">
            <i class="icon-download m-icon" style="font-size: 18px; padding-right: 15px" @click.stop="download" />
            <i :class="modeIcon" class="m-icon" style="font-size: 18px; padding-right: 15px" @click.stop="toggleMode" />
          </div>
          <div class="center">
            <i class="icon-prev m-icon" style="font-size: 24px" @click="prev" />
            <i :class="playIcon" class="m-icon" style="padding: 0 20px;font-size: 24px" @click.stop="togglePlay" />
            <i class="icon-next m-icon" style="font-size: 24px" @click="next" />
          </div>
          <div class="right">
            <i :class="favorIcon" class="m-icon" style="font-size: 18px; padding-right: 15px" @click.stop="toggleFavor" />
            <span class=" m-icon" @click.stop="togglePlaylist">
              <i class="icon-playlist" style="font-size: 18px; padding-right: 0px" />
              {{ playList.length }}
            </span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen" class="mini" @click="closePlaylist">
        <process-bar :percent="percent" @progressChange="changeTime" />
        <div class="left">
          <div class="img" @click="setFull">
            <img :src="imgUrl" onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'" width="50" height="50" alt="">
            <div class="filter">
              <i class="icon-extend m-icon" />
            </div>
          </div>
          <div class="info">
            <p>{{ currentSong.name }} - {{ singers }}</p>
            <div>
              <i :class="favorIcon" class="m-icon" style="font-size: 15px; line-height: 25px" @click.stop="toggleFavor" />
              <i :class="modeIcon" class="m-icon" style="font-size: 15px; line-height: 25px;" @click.stop="toggleMode" />
            </div>
          </div>
        </div>
        <div class="center">
          <i class="icon-prev icon m-icon" style="font-size: 24px" @click="prev" />
          <i class="icon m-icon" :class="playIcon" style="padding: 0 20px;font-size: 24px" @click="togglePlay" />
          <i class="icon-next icon m-icon" style="font-size: 24px" @click="next" />
        </div>
        <div class="right">
          <span class="time">{{ format(currentTime) }} / {{ format(currentSong.interval) }}</span>
          <span style="padding-right: 20px; font-size: 13px" @click.stop="togglePlaylist">
            <i class="icon-playlist" style="font-size: 15px;padding-right: 0" />{{ playList.length }}
          </span>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @ended="end"
      @error="error"
      @timeupdate="updateTime"
    />
    <play-list ref="playlist" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Lyric from 'lyric-parser'
import { playMode } from '../../assets/js/config'
import ProcessBar from '../process-bar/process-bar'
import Scroll from '../scroll/scroll'
import PlayList from '../playlist/playlist'
import { shuffle } from '../../assets/js/utils'

import { saveFavorite, deleteFavorite, loadFavorite, savePlayHistory } from '../../assets/js/cache'

export default {
  name: 'Player',
  components: { ProcessBar, Scroll, PlayList },
  data() {
    return {
      canPlay: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNumber: 0,
      singleLyric: ''
    }
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.interval
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    modeIcon() {
      if (this.mode === playMode.random) {
        return 'icon-random'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      }
      return 'icon-sequence'
    },
    singers() {
      if (this.currentSong.singer) {
        return this.currentSong.singer.map((s) => {
          return s.name
        }).join('/')
      }
      return ''
    },
    favorIcon() {
      return this.isFavorite() ? 'icon-favorite' : 'icon-not-favorite'
    },
    imgUrl() {
      return this.currentSong.imgUrl
    },
    ...mapGetters([
      'currentSong',
      'playList',
      'currentIndex',
      'fullScreen',
      'mode',
      'playing',
      'favoriteList',
      'sequenceList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.songId === oldSong.songId || !newSong.songId) {
        return
      }
      this.canPlay = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 30)
    },
    playing(newPlay) {
      const audio = this.$refs.audio
      if (audio) {
        newPlay ? audio.play() : audio.pause()
      }
    },
    canPlay(newPlay) {
      if (newPlay && this.playing && this.currentLyric) {
        setTimeout(() => {
          this.currentLyric.play()
        }, 20)
      }
    },
    fullScreen(flag) {
      if (flag) {
        this.setFull()
      } else {
        this.exitFull()
      }
    }
  },
  mounted() {
    this.setFavoriteList(loadFavorite())
    this.toggleFavor = function () {
      if (this.isFavorite()) {
        this.setFavoriteList(deleteFavorite(this.currentSong))
      } else {
        this.setFavoriteList(saveFavorite(this.currentSong))
      }
      this.closePlaylist()
    }
    this.savePlayHistory = function (song) {
      this.setPlayHistory(savePlayHistory(song))
    }
    document.addEventListener('fullscreenchange', this.fullScreenChange)
    document.addEventListener('mozfullscreenchange', this.fullScreenChange)
    document.addEventListener('webkitfullscreenchange', this.fullScreenChange)
    document.addEventListener('msfullscreenchange', this.fullScreenChange)
  },
  methods: {
    setFull() {
      const el = this.$refs.normal
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else {
        el.msRequestFullscreen()
      }
    },
    exitFull() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExiFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    },
    fullScreenChange() {
      const isFull = (document.fullscreenElement ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled)
      if (!isFull) {
        this.setFullScreen(false)
      } else {
        this.setFullScreen(true)
      }
    },
    download() {
      const that = this
      const url = this.currentSong.url // 目标地址
      const filename = `${this.currentSong.name} - ${this.singers}.mp3`
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
    selectSinger(s) {
      this.$router.push(`/singer/detail?id=${s.id}&type=${this.currentSong.type}`)
      this.setFullScreen(false)
    },
    selectAlbum(al) {
      this.$router.push(`/album?id=${al.id}&type=${this.currentSong.type}`)
      this.setFullScreen(false)
    },
    togglePlaylist() {
      if (this.$refs.playlist.flag) {
        this.$refs.playlist.hidden()
      } else {
        this.$refs.playlist.show()
      }
    },
    closePlaylist() {
      this.$refs.playlist.hidden()
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.currentLyric.seek(0)
        // if (this.playing && this.canPlay) {
        //   this.currentLyric.play()
        // }
      }).catch((e) => {
        this.singleLyric = e
        this.currentLyric = null
        this.currentLineNumber = 0
      })
    },
    handleLyric({ lineNum }) {
      this.currentLineNumber = lineNum
      const limit = Math.floor(this.$refs.lyricList.$el.clientHeight / 60)
      if (lineNum > limit) {
        const curEl = this.$refs.lyric[lineNum - limit]
        this.$refs.lyricList.scrollToElement(curEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    ready() {
      this.canPlay = true
      this.savePlayHistory(this.currentSong)
    },
    error() {
      this.canPlay = true
      this.$message.error('播放当前歌曲权限不足，将切换下一首')
      if (this.nextTimer) {
        clearTimeout(this.nextTimer)
      }
      this.nextTimer = setTimeout(() => {
        if (this.playing) {
          this.next()
        }
      }, 1000)
    },
    end() {
      if (this.mode === playMode.loop) { // 单曲循环
        this.loop()
      } else { // 其他模式，播放下一首
        this.next()
      }
    },
    loop() { // 循环播放
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.currentLyric && this.currentLyric.seek(0)
    },
    next() { // 播放下一首
      if (!this.canPlay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        const index = this.currentIndex + 1 === this.playList.length ? 0 : this.currentIndex + 1
        this.setCurrentIndex(index)
      }

      if (!this.playing) {
        this.togglePlay()
      }
      this.closePlaylist()
      this.canPlay = false
    },
    prev() { // 播放上一首
      if (!this.canPlay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        const index = this.currentIndex - 1 < 0 ? this.playList.length - 1 : this.currentIndex - 1
        this.setCurrentIndex(index)
      }

      if (!this.playing) {
        this.togglePlay()
      }
      this.closePlaylist()
      this.canPlay = false
    },
    togglePlay() { // 修改播放状态
      if (!this.canPlay) {
        return
      }
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.closePlaylist()
    },
    updateTime(e) { // 更新歌曲时间
      this.currentTime = e.target.currentTime
    },
    changeTime(percent) { // 滑动滚动条修改歌曲时间
      this.$refs.audio.currentTime = percent * this.currentSong.interval
      this.currentLyric && this.currentLyric.seek(percent * this.currentSong.interval * 1000)
      if (!this.playing) {
        this.togglePlay()
      }
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
    toggleMode() {
      const mode = (this.mode + 1) % 3
      // eslint-disable-next-line no-unused-vars
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setCurrentIndex(list.findIndex(item => item.songId === this.currentSong.songId))
      this.setPlayList(list)
      this.setMode(mode)
      this.closePlaylist()
    },
    isFavorite() {
      if (this.favoriteList.length > 0) {
        return this.favoriteList.findIndex(item => item.songId === this.currentSong.songId) !== -1
      }
      return false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlaying: 'SET_PLAYING',
      setFavoriteList: 'SET_FAVORITE_LIST',
      setPlayHistory: 'SET_PLAY_HISTORY',
      setShowMsg: 'SET_SHOW_MSG'
    }),
    ...mapActions([
      'displayMsg'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
  .player
    z-index 100
    position fixed
    bottom 0
    width 100%
    .normal
      position fixed
      bottom 0
      left 0
      width 100%
      height 100%
      overflow hidden
      background #222
      padding 0 20px
      box-sizing border-box
      display flex
      flex-direction column
      z-index 10
      .background-mask
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        background-color: rgba(0,0,0,.35);
        overflow hidden
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        filter blur(35px)
        z-index -2
        overflow hidden
        opacity .6
        transform translateZ(0)
        background-position: 50%;
        background-size cover
        background-repeat no-repeat
      .el-icon-arrow-down
        flex 0 0 25px
        padding-top: 10px;
        line-height 25px
        font-size: 24px;
        color: #cbced1
        transition all .2s
        &:hover
          color $color-theme
          cursor pointer
      .middle
        flex 1
        padding 20px 0
        display flex
        align-items center
        .album
          flex 1
          text-align right
          padding-right 40px
          img
            height 50%
            width 50%
        .info
          flex 1
          height 90%
          padding-left 40px
          display flex
          flex-direction column
          .title
            font-size $font-size-large-x
            line-height 30px
            color #fff
            no-wrap()
            width 80%
          .desc
            line-height 30px
            font-size $font-size-medium
            color #fff
            width 80%
            no-wrap()
            padding-bottom 30px
            .singer:hover, .album:hover
              cursor pointer
              color $color-theme
          .lyric
            flex 1
            height 100%
            width 80%
            color rgba(255, 255, 255, .8)
            font-size $font-size-medium-x
            position relative
            .container
              position absolute
              left 0
              top 0
              right 0
              bottom 0
              overflow hidden
              .current
                color $color-theme
              .text
                line-height 30px
                no-wrap()
              .single
                line-height 30px
                margin-top 40%
              .scroll
                width 100%
                height 100%
                &:hover
                  cursor grab
      .time
        height 10px
        flex 0 0 10px
        display flex
        padding 0 5px 10px
        line-height 10px
        .left, .right
          flex 1
          color rgba(255, 255, 255, .6)
          font-size $font-size-medium
        .right
          text-align right
      .options
        position relative
        width 100%
        height 60px
        flex 0 0 60px
        display flex
        align-items center
        .left
          flex 1
          color #ccc
        .center
          flex 0 0 400px
          text-align center
          color #fff
        .right
          flex 1
          text-align right
          color #ccc
    .mini
      position relative
      display flex
      bottom 0
      left 0
      right 0
      margin-right -10px
      height 60px
      background $color-background
      align-items center
      color rgba(230,230,230,0.8)
      .left
        padding-left 10px
        display flex
        flex 1
        no-wrap()
        .img
          height: 50px;
          width: 50px;
          position: relative
          cursor pointer
          &:hover
            .filter
              opacity 1
          .filter
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            background rgba(0, 0, 0, .5)
            text-align center
            line-height 50px
            opacity 0
            transition all .2s
            .icon-extend
              color #fff
              padding 0
              font-size $font-size-large
        .info
          padding-left 10px
          display flex
          flex-direction column
          justify-content center
          width 80%
          p
            font-size 13px
            line-height 25px
            no-wrap()
      .center
        width 400px
        text-align center
      .right
        flex 1
        text-align: right
        padding-right 10px
        font-size $font-size-medium
        .time
          padding-right 10px
          font-size $font-size-small
          color $color-text-d
      &.mini-enter-active, &.mini-leave-active
        transition all .4s
      &.mini-enter, &.mini-leave-to
        transform translate3d(0, 60px, 0)
  .icon-favorite
    color #ff6a6a
  .icon
    color $color-theme
  .m-icon
    &:hover
      color $color-theme
      cursor pointer
      &.icon-favorite
        color #ff6a6a
</style>

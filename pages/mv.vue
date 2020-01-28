<template>
  <div class="mv-wrapper">
    <div ref="player" class="player" @mousedown="togglePlay" @mousemove="showOption">
      <video
        ref="video"
        :src="mvUrl"
        autoplay
        @timeupdate="updateTime"
        @ended="end"
        @canplay="ready"
        @error="error"
      />
      <div v-show="flag" class="controls" @mouseover="toggleFlag(true)" @mouseout="toggleFlag(false)">
        <div class="progress" @mousedown.stop>
          <progress-bar :percent="percent" @progressChange="changeCurrentTime" />
        </div>
        <div class="options">
          <i :class="playIcon" class="icon" @mousedown.stop @click="togglePlay" />
          <span class="time">
            {{ time }}
          </span>
          <i :class="vIcon" class="icon" style="position: absolute; right: 125px; font-size: 15px" @mousedown.stop @click="toggleVolume(!showVolume)" />
          <div v-show="showVolume" ref="volume" class="video-volume" @mousedown.stop>
            <volume-bar :percent="volume" @progressChange="changeVolume" />
          </div>
          <div class="type icon" @mousedown.stop @click="toggleQuality(!showQuality)">
            {{ type(quality) }}
          </div>
          <ul v-show="showQuality" class="quality-type">
            <li v-for="(q, index) in brs" :key="index" class="item icon" @mousedown.stop @click="changeQuality(q)">
              {{ type(q) }}
            </li>
          </ul>
          <i :class="screenIcon" class="icon" style="position: absolute; right: 0" @mousedown.stop @click="toggleScreen" />
        </div>
      </div>
      <i v-show="!playing" class="icon-playbtn icon" />
    </div>
    <div class="info">
      <p class="title">
        {{ mvInfo.name }}
      </p>
      <p class="desc">
        演唱：<span style="font-size: 14px; color: #c4c8d7">{{ creater }}</span>
        <span style="padding-left: 10px">{{ playNum }}次观看</span>
        <span style="padding-left: 10px">
          发布时间：{{ mvInfo.publishTime }}
        </span>
      </p>
    </div>
    <mv-list :mvs="mvList"></mv-list>
  </div>
</template>

<script>
import ProgressBar from '../components/process-bar/process-bar'
import VolumeBar from '../components/volume-bar/volume-bar'
import MvList from '../components/MvList/MvList'
import { mvInfo } from '../api/index/mv'

export default {
  name: 'Mv',
  components: { ProgressBar, VolumeBar, MvList },
  data() {
    return {
      currentTime: 0,
      mvInfo: {},
      mvList: [],
      brs: [],
      playing: true,
      quality: 0,
      showQuality: false,
      vIcon: '',
      showVolume: false,
      volume: 1,
      change: false,
      lastTime: 0,
      canPlay: false,
      fullScreen: false,
      flag: false,
      clearTimer: false
    }
  },
  computed: {
    mvUrl() {
      if (this.$route.query.type !== undefined) {
        return `http://encounter-music.cn:81/api/${this.$route.query.type}MvUrl?id=${this.$route.query.id}&type=${this.quality}`
      }
      return ''
    },
    percent() {
      return this.currentTime / this.mvInfo.interval
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    screenIcon() {
      return this.fullScreen ? 'icon-not-full' : 'icon-full'
    },
    time() {
      const cur = Math.floor(this.currentTime)
      return `${this._pad(Math.floor(cur / 60))}:${this._pad(cur % 60)}/${this._pad(Math.floor(this.mvInfo.interval / 60))}:${this._pad(this.mvInfo.interval % 60)}`
    },
    creater() {
      if (this.mvInfo.singer) {
        return this.mvInfo.singer.map(s => s.name).join('/')
      }
      return ''
    },
    playNum() {
      if (this.mvInfo.playNum) {
        return this.mvInfo.playNum.toString().length > 5 ? `${(this.mvInfo.playNum / 10000).toFixed(1)}万` : this.mvInfo.playNum
      }
      return ''
    }
  },
  watch: {
    playing(newPlay) {
      const video = this.$refs.video
      if (video) {
        newPlay ? video.play() : video.pause()
      }
    },
    $route() {
      this.initial()
    }
  },
  activated() {
    this.initial()
    document.addEventListener('fullscreenchange', this.fullScreenChange)
    document.addEventListener('mozfullscreenchange', this.fullScreenChange)
    document.addEventListener('webkitfullscreenchange', this.fullScreenChange)
    document.addEventListener('msfullscreenchange', this.fullScreenChange)
  },
  methods: {
    initial() {
      this.playing = true
      this.fullScreen = false
      this.volume = 1
      this.vIcon = 'icon-volume'
      this.showVolume = false
      this.showQuality = false
      this.lastTime = 0
      this.flag = false
      this.clearTimer = false
      this.mvInfo = {}
      this.brs = []
      this.mvList = []
      this.currentTime = 0
      mvInfo(this.$route.query.id, this.$route.query.type).then((res) => {
        this.mvInfo = res.info
        this.mvList = res.list
        this.brs = res.brs
        this.quality = this.brs[this.brs.length - 1]
      })
    },
    showOption(e) {
      if (!this.clearTimer) {
        this.flag = true
        e.target.style.cursor = 'pointer'
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          e.target.style.cursor = 'none'
          this.flag = false
        }, 3000)
      } else {
        clearTimeout(this.timer)
      }
    },
    toggleFlag(f) {
      this.clearTimer = f
      this.flag = f
    },
    toggleScreen() {
      this.fullScreen ? this.exitFull() : this.setFull()
    },
    setFull() {
      const el = this.$refs.player
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
      this.fullScreen = isFull
    },
    toggleQuality(flag) {
      this.showQuality = flag
    },
    ready(e) {
      this.canPlay = true
      this.playing = true
      if (this.change) {
        e.target.currentTime = this.lastTime
        this.change = false
      }
    },
    changeQuality(q) {
      if (this.currentTime > 0) {
        this.lastTime = this.currentTime
      }
      setTimeout(() => {
        this.change = true
        this.quality = q
      }, 20)
      setTimeout(() => {
        this.showQuality = false
      }, 200)
    },
    changeVolume(percent) {
      this.volume = Math.min(percent, 1)
      this.$refs.video.volume = this.volume
      if (percent === 0) {
        this.vIcon = 'icon-mute'
      } else {
        this.vIcon = 'icon-volume'
      }
    },
    type(quality) {
      let re = ''
      switch (quality) {
        case '240':
          re = '标清'
          break
        case '480':
          re = '高清'
          break
        case '720':
          re = '超清'
          break
        case '1080':
          re = '蓝光'
          break
      }
      return re
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    changeCurrentTime(percent) {
      this.playing = true
      this.$refs.video.currentTime = percent * this.mvInfo.interval
    },
    togglePlay() {
      this.playing = !this.playing
    },
    toggleVolume(flag) {
      this.showVolume = flag
    },
    end() {
      this.$refs.video.currentTime = 0
      this.$refs.video.play()
    },
    error(e) {
      e.target.src = `http://encounter-music.cn:81/api/${this.$route.query.type}MvUrl?id=${this.$route.query.id}&type=${this.quality}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      if (len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/stylus/variable.styl"
  .mv-wrapper
    height 100%
    width 100%
    overflow-x hidden
    overflow-y scroll
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
    .player
      position relative
      width 100%
      padding 0 20px
      box-sizing border-box
      padding-top 50%
      video
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        background #000
      .controls
        position absolute
        bottom 0
        width calc(100% - 40px)
        height 40px
        .options
          line-height: 40px
          &:hover
            cursor: normal
          .time
            padding-left 15px
            font-size 13px
          .video-volume
            right 115px
            bottom 55px
            height 117px
            width 47px
            position absolute
            background rgba(0, 0, 0, .8)
            &:after
              position absolute
              content ''
              bottom -8px
              left 50%
              transform translateX(-50%)
              width 0
              height 0
              border-right:8px solid transparent
              border-left:8px solid transparent
              border-top:8px solid rgba(0, 0, 0, .8)
          .type
            position absolute
            right 50px
            top 8px
            line-height 24px
            font-size $font-size-medium
            padding 0 10px
            border-radius 5px
            border 1px solid $color-text-d
            box-sizing border-box
          .quality-type
            right 50px
            bottom 55px
            width 50px
            position absolute
            background rgba(0, 0, 0, .8)
            &:after
              position absolute
              content ''
              bottom -8px
              left 50%
              transform translateX(-50%)
              width 0
              height 0
              border-right:8px solid transparent
              border-left:8px solid transparent
              border-top:8px solid rgba(0, 0, 0, .8)
            .item
              line-height 28px
              text-align center
              font-size $font-size-medium
      .icon-playbtn
        position absolute
        top 50%
        left 50%
        transform translate3d(-50%, -50%, 0)
        font-size 30px
    .info
      padding 0 20px
      .title
        line-height 30px
        font-size $font-size-medium-x
        font-weight: bold
      .desc
        line-height 25px
        font-size $font-size-small-x
        color $color-text-d
  .icon
    transition all .2s
    &:hover
      cursor pointer
      color $color-theme
</style>

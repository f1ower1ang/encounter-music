<template>
  <div class="list-content" @click="hiddenMenu">
    <el-row class="title">
      <el-col v-if="rank" :span="1" style="padding-left: 10px">
        -
      </el-col>
      <el-col :span="span2" style="padding-left: 10px">
        歌曲 <span v-if="!rank">{{ num || ' ' }}</span>
      </el-col>
      <el-col :span="4">
        歌手
      </el-col>
      <el-col :span="4" style="padding-left: 10px; box-sizing: border-box">
        专辑
      </el-col>
      <el-col :span="2" style="padding-left: 10px; box-sizing: border-box">
        时长
      </el-col>
    </el-row>
    <el-row
      v-for="(song, index) in songs"
      :key="index"
      :class="{current: song.songId === currentSong.songId && playing, show: curNum === index}"
      class="item"
      @dblclick.native="playSong(index)"
      @click.native="setCurrentNum(index)"
    >
      <el-col v-if="rank" :span="1" :class="{rank: index < 3}" style="padding-left: 10px">
        {{ index + 1 }}
      </el-col>
      <el-col :span="span1" style="padding-left: 10px">
        <i class="icon" :class="getIcon(song)" style="opacity: 1" @click="toggleFavorite(song)" @dblclick.stop />
        <span :class="{dark: song.name === '？'}">{{ song.name }}</span>
        <i v-if="song.mvId !== 0" class="icon-video" @click="playMv(song)" />
      </el-col>
      <el-col :span="3">
        <i
          class="icon"
          :class="(currentSong.songId === song.songId && playing) ? 'icon-mini-pause' : 'icon-mini-play'"
          @click="playSong(index)"
        />
        <i class="icon icon-download" @click.stop="download(song)" @dblclick.stop />
        <i class="icon icon-menu" @click.stop="showMenu($event, song, index)" @dblclick.stop />
      </el-col>
      <el-col :span="4">
        <span v-for="(s, id) in song.singer" :key="id" @click="selectSinger(s, song.type)">
          {{ s.name }}
        </span>
      </el-col>
      <el-col :span="4" style="padding-left: 10px; box-sizing: border-box">
        <span @click="selectAlbum(song.album, song.type)">
          {{ song.album.name }}
        </span>
      </el-col>
      <el-col :span="2" style="box-sizing: border-box; padding-left: 10px">
        {{ format(song.interval) }}
      </el-col>
    </el-row>
    <Menu
      ref="menu"
      :show-del="showDel"
      :song="song"
      :songs="songs"
      :index="curNum"
      :favor="fav"
      :type="type"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { loadFavorite, saveFavorite, deleteFavorite } from '../../assets/js/cache'
import Menu from '../../components/Menu/Menu'

export default {
  name: 'Songlist',
  components: { Menu },
  props: {
    songs: {
      type: Array,
      default: null
    },
    num: {
      type: Number,
      default: 0
    },
    rank: {
      type: Boolean,
      default: false
    },
    showDel: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'playlist'
    },
    insert: {
      type: String,
      default: 'false'
    },
    route: {
      type: String,
      default: 'others'
    }
  },
  data() {
    return {
      curNum: -1,
      song: null,
      fav: false
    }
  },
  computed: {
    span1() {
      return this.rank ? 10 : 11
    },
    span2() {
      return this.rank ? 13 : 14
    },
    ...mapGetters([
      'currentSong',
      'playing',
      'favoriteList'
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
    }
  },
  methods: {
    playMv(song) {
      if (this.route === 'search') {
        this.$router.push(`/search/mv?id=${song.mvId}&type=${song.type}`)
      } else {
        this.$router.push(`/mv?id=${song.mvId}&type=${song.type}`)
      }
    },
    download(song) {
      this.hiddenMenu()
      const singers = song.singer.map(s => s.name).join('/')
      const that = this
      const url = song.url // 目标地址
      const filename = `${song.name} - ${singers}.mp3`
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
    selectSinger(singer, type) {
      this.$router.push(`/singer/detail?id=${singer.id}&type=${type}`)
    },
    selectAlbum(album, type) {
      this.$router.push(`/album?id=${album.id}&type=${type}`)
    },
    isFavorite(song) {
      return this.favoriteList.findIndex(item => song.songId === item.songId) !== -1
    },
    setCurrentNum(index) {
      this.curNum = index
    },
    showMenu(e, song, index) {
      this.song = song
      this.$refs.menu.show()
      if (e.clientY > window.innerHeight / 2) {
        this.$refs.menu.$el.style.top = ''
        this.$refs.menu.$el.style.bottom = `${window.innerHeight - e.clientY}px`
      } else {
        this.$refs.menu.$el.style.top = `${e.clientY}px`
        this.$refs.menu.$el.style.bottom = ''
      }
      this.$refs.menu.$el.style.right = `${window.innerWidth - e.clientX}px`
      this.fav = this.favoriteList.findIndex((s) => { return s.songId === song.songId }) !== -1
      this.curNum = index
    },
    hiddenMenu() {
      this.$refs.menu.hidden()
    },
    playSong(index) {
      if (this.songs[index].songId === this.currentSong.songId) {
        this.setPlaying(!this.playing)
      } else if (this.insert === 'false') {
        this.selectPlay({
          list: this.songs,
          index
        })
      } else if (this.insert === 'true') {
        this.insertSong(this.songs[index])
      }
    },
    getIcon(song) {
      return this.favoriteList.findIndex(item => item.songId === song.songId) === -1 ? 'icon-not-favorite' : 'icon-favorite'
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
    ...mapActions([
      'selectPlay',
      'displayMsg',
      'insertSong'
    ]),
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setFavoriteList: 'SET_FAVORITE_LIST',
      setShowMsg: 'SET_SHOW_MSG'
    })
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
.list-content
  padding 0 20px
  .title
    color $color-text-d
    border-top 1px solid $color-border
  .el-row
    line-height 40px
    font-size $font-size-medium
    border-bottom 1px solid $color-border
    text-overflow: ellipsis
    white-space: nowrap
    &:last-child
      border-bottom none
    &.show
      background $color-background-l
      .icon
        opacity 1
    .icon
      margin-right 5px
      font-weight lighter
      opacity 0
      &:last-child
        margin-right 0
      &:hover
        cursor pointer
        color $color-theme
    .icon-favorite
      color #ff6a6a
      &:hover
        color #ff6a6a
    .rank
      color red
    .el-col-11
      no-wrap()
      .icon
        opacity 1
    .el-col-4
      no-wrap()
    .el-col-3
      no-wrap()
  .item
    position relative
    &:hover
      background $color-background-l
      .icon
        opacity 1
    .el-col-4
      span
        padding-right 5px
        transition all .2s
        &:hover
          color $color-theme
          cursor pointer
  .dark
    color #ccc
  .current
    color $color-theme
    &:before
      position absolute
      content ''
      left -3px
      height 100%
      width 3px
      top 0
      background $color-theme
    .icon
      color $color-text-l
      opacity 1
    .icon-favorite
      color #ff6a6a
  .icon-video:hover
    color #fff
    cursor pointer
</style>

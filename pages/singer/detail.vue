<template>
  <div class="singer-detail" @scroll="hiddenMenu">
    <template v-if="flag">
      <div class="top" @click="hiddenMenu">
        <div class="left">
          <img :src="imgUrl" alt="" :onerror="defaultImg" width="100%" style="border-radius: 50%">
        </div>
        <div class="right">
          <p class="title">
            {{ name }}
          </p>
          <div style="flex: 1" />
          <div class="desc">
            <div class="text" v-html="brief" />
          </div>
        </div>
      </div>
      <ul class="nav" @click="hiddenMenu">
        <li :class="{ active: currentPage === 'song' }" @click="changeCurPage('song')">
          歌曲<span style="font-size: 12px">{{ totalSong }}</span>
        </li>
        <li :class="{ active: currentPage === 'album' }" @click="changeCurPage('album')">
          专辑<span style="font-size: 12px">{{ totalAlbum }}</span>
        </li>
        <li :class="{ active: currentPage === 'mv' }" @click="changeCurPage('mv')">
          MV<span style="font-size: 12px">{{ totalMv }}</span>
        </li>
      </ul>
    </template>
    <div style="height: calc(100% - 227px)">
      <pagination
        v-if="currentPage === 'song'"
        :flag="flag"
        :total="totalSong"
        :page="songPage"
        @current-change="handleSong"
        @prev-click="changeSong(songPage - 1)"
        @next-click="changeSong(songPage + 1)"
      >
        <div v-if="flag" slot="content">
          <el-row v-show="song.length > 0" class="options">
            <el-button icon="icon-mini-play" type="success" @click="allPlay({ list: song })">
              播放全部
            </el-button>
          </el-row>
          <song-list v-show="song.length > 0" ref="songlist" :songs="song" />
        </div>
        <div v-show="song.length === 0" ref="loading" slot="loading" class="loading">
          <loading />
        </div>
      </pagination>
      <pagination
        v-if="currentPage === 'album'"
        :flag="flag"
        :total="100"
        :size="100"
        :page="1"
        class="album"
      >
        <disc-list slot="content" :discs="album" type="album" />
        <div v-show="album.length === 0" slot="loading" class="loading">
          <loading />
        </div>
      </pagination>
      <pagination
        v-if="currentPage === 'mv'"
        :flag="flag"
        :total="totalMv"
        :page="mvPage"
        :size="24"
        @current-change="handleMv"
        @prev-click="changeMv(mvPage - 1)"
        @next-click="changeMv(mvPage + 1)"
      >
        <div v-if="flag" slot="content">
          <mv-list v-show="mv.length > 0" :mvs="mv" />
        </div>
        <div v-show="mv.length === 0" ref="loading" slot="loading" class="loading">
          <loading />
        </div>
      </pagination>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import songList from '../../components/songlist/songlist'
import Loading from '../../components/Loading/Loading'
import pagination from '../../components/pagination/pagination'
import DiscList from '../../components/DiscList/DiscList'
import MvList from '../../components/MvList/MvList'
import { singerSong, singerDetail, singerAlbum, singerMv } from '../../api/index/singer'

export default {
  name: 'Detail',
  components: { songList, Loading, pagination, DiscList, MvList },
  data() {
    return {
      song: [],
      album: [],
      mv: [],
      imgUrl: '',
      name: '',
      songPage: 1,
      albumPage: 0,
      mvPage: 1,
      totalSong: 0,
      totalAlbum: 0,
      totalMv: 0,
      brief: '',
      currentPage: 'song',
      flag: false,
      defaultImg: `this.src="${require('../../assets/image/error.png')}"`,
      history: '',
      list: false
    }
  },
  watch: {
    currentPage(page) {
      if (page === 'album') {
        if (this.album.length > 0) {
          return
        }
        singerAlbum(this.$route.query.id, this.$route.query.type).then((res) => {
          this.album = res
        })
      } else if (page === 'mv') {
        if (this.mv.length > 0) {
          return
        }
        singerMv(this.$route.query.id, this.$route.query.type, 24, 0).then((res) => {
          this.mv = res
        })
      }
    },
    $route(n, o) {
      this.history = o.name
    }
  },
  activated() {
    if (this.history === 'album' || this.history === 'mv') {
      return
    }
    this.song = []
    this.album = []
    this.mv = []
    this.mvPage = 1
    this.songPage = 1
    this.currentPage = 'song'
    this.flag = false
    this.getSong(1)
    this.getDetail()
  },
  methods: {
    handleMv(val) {
      this.getMv(val)
    },
    changeMv(page) {
      this.mvPage = page
    },
    async getMv(page) {
      this.mv = []
      const mv = await singerMv(this.$route.query.id, this.$route.query.type, 24, page - 1)
      this.mv = mv
      this.mvPage = page
      this.flag = true
    },
    hiddenMenu() {
      if (this.$refs.songlist) {
        this.$refs.songlist.hiddenMenu()
      }
    },
    async getSong(page) {
      const type = this.$route.query.type
      const p = type === 'qq' ? page - 1 : page
      this.song = []
      const { song } = await singerSong(this.$route.query.id, 30, p, this.$route.query.type)
      this.song = song
      this.songPage = page
      this.flag = true
    },
    selectAlbum(album) {
      this.$router.push(`/album?id=${album.id}&type=qq`)
    },
    handleSong(val) {
      this.getSong(val)
    },
    changeSong(page) {
      this.songPage = page
    },
    changeCurPage(page) {
      this.currentPage = page
    },
    async getDetail() {
      const { singer } = await singerDetail(this.$route.query.id, this.$route.query.type)
      this.imgUrl = singer.imgUrl
      this.name = singer.name
      this.totalSong = singer.totalSong
      this.totalAlbum = singer.totalAlbum
      this.totalMv = singer.totalMv
      this.brief = singer.brief
    },
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
.singer-detail
  height 100%
  overflow: auto
  background $color-background-l
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar
    display: none; /* Chrome Safari */
  .top
    padding 20px 20px
    height 140px
    display flex
    background $color-background-d
    .left
      flex 0 0 140px
      height 140px
      padding-right 20px
    .right
      flex 1
      height 140px
      display flex
      flex-direction column
      .title
        width 80%
        font-size $font-size-large-x
        font-weight bold
      .desc
        padding-top 5px
        line-height 23px
        font-size $font-size-medium
        color $color-text-d
        width 90%
        overflow hidden
        text-overflow ellipsis
        &:before
          float left
          width 5px
          content ' '
          height 100%
        &:after
          float: right;
          text-align: center;
          content: "...";
          height: 100%;
          line-height: 22px;
          /* 为三个省略号的宽度 */
          width: 3em;
          /* 使盒子不占位置 */
          margin-left: -3em;
          /* 移动省略号位置 */
          position: relative;
          left: 100%;
          top: -23px;
          padding-right: 5px;
          /* 显示更好的效果 */
          background: -webkit-gradient(linear, left top, right top, from(rgba(239, 239, 239, 0)), to($color-background-d), color-stop(50%, $color-background));
          background: -moz-linear-gradient(to right, rgba(239, 239, 239, 0), $color-background-d 50%, $color-background-d);
          background: -o-linear-gradient(to right, rgba(239, 239, 239, 0), $color-background-d 50%, $color-background-d);
          background: -ms-linear-gradient(to right, rgba(239, 239, 239, 0), $color-background-d 50%, $color-background-d);
          background: linear-gradient(to right, rgba(239, 239, 239, 0), $color-background-d 50%, $color-background-d);
        .text
          float right
          margin-left -5px
          width 100%
          word-break break-all
  .nav
    height 40px
    padding 0 20px
    display flex
    border-bottom 1px solid $color-border
    li
      line-height 40px
      margin-right 20px
      font-size $font-size-medium
      transition all .2s
      &.active
        border-bottom 1px solid $color-theme
        color $color-theme
      &:hover
        color $color-theme
        border-bottom 1px solid $color-theme
        cursor pointer
  .options
    line-height 50px
    padding 0 20px
    .el-button
      font-size $font-size-medium
      padding: 5px 12px;
      &.el-button--success
        background $color-theme
        border-color $color-theme
        color $color-text
.album
  padding 0 20px
.loading
  width 100%
  flex 1
</style>

<template>
  <div class="search" @click="hiddenMenu">
    <ul class="nav">
      <li :class="{ active: currentPage === 'song' }" @click="changeCurPage('song')">
        歌曲
      </li>
      <li :class="{ active: currentPage === 'album' }" @click="changeCurPage('album')">
        专辑
      </li>
      <li :class="{ active: currentPage === 'disc' }" @click="changeCurPage('disc')">
        歌单
      </li>
      <li :class="{ active: currentPage === 'singer' }" @click="changeCurPage('singer')">
        歌手
      </li>
      <li :class="{ active: currentPage === 'mv' }" @click="changeCurPage('mv')">
        视频
      </li>
    </ul>
    <div class="search-result" @scroll="hiddenMenu">
      <pagination
        v-show="currentPage === 'song'"
        :total="songCount"
        :page="songPage"
        :flag="flag"
        @current-change="handlePage"
        @prev-click="changePage(songPage - 1)"
        @next-click="changePage(songPage + 1)"
      >
        <div slot="content">
          <el-row v-show="songs.length > 0" style="line-height: 50px; padding: 0 20px">
            <el-button icon="icon-mini-play" type="success" style="padding: 8px 15px; border-color: #e7d8b1; background-color: #e7d8b1; color: #000" @click="allPlay({ list: songs })">
              播放全部
            </el-button>
          </el-row>
          <song-list v-show="songs.length > 0" ref="songlist" route="search" insert="true" :songs="songs" />
        </div>
        <div v-show="songs.length === 0" slot="loading" style="flex: 1">
          <loading v-show="songCount !== -1" />
          <no-result v-show="songCount === -1" />
        </div>
      </pagination>
      <pagination
        v-show="currentPage === 'album'"
        :total="albumCount"
        :page="albumPage"
        :flag="flag"
        @current-change="handlePage"
        @prev-click="changePage(albumPage - 1)"
        @next-click="changePage(albumPage + 1)"
      >
        <div slot="content">
          <disc-list v-show="albums && albums.length > 0" style="padding: 0 20px; box-sizing: border-box" type="album" route="search" :discs="albums" />
        </div>
        <div v-show="albums && albums.length === 0" slot="loading" style="flex: 1">
          <loading v-show="albumCount !== -1" />
          <no-result v-show="albumCount === -1" />
        </div>
      </pagination>
      <pagination
        v-show="currentPage === 'disc'"
        :total="discCount"
        :page="discPage"
        :flag="flag"
        @current-change="handlePage"
        @prev-click="changePage(discPage - 1)"
        @next-click="changePage(discPage + 1)"
      >
        <div slot="content">
          <disc-list v-show="discs && discs.length > 0" style="padding: 0 20px; box-sizing: border-box" route="search" type="disc" :discs="discs" />
        </div>
        <div v-show="discs && discs.length === 0" slot="loading" style="flex: 1">
          <loading v-show="discCount !== -1" />
          <no-result v-show="discCount === -1" />
        </div>
      </pagination>
      <pagination
        v-show="currentPage === 'singer'"
        :total="singerCount"
        :page="singerPage"
        :flag="flag"
        @current-change="handlePage"
        @prev-click="changePage(singerPage - 1)"
        @next-click="changePage(singerPage + 1)"
      >
        <div slot="content">
          <singer-list v-show="singers && singers.length > 0" style="padding: 0 20px; box-sizing: border-box" route="search" :singers="singers" />
        </div>
        <div v-show="singers && singers.length === 0" slot="loading" style="flex: 1">
          <loading v-show="singerCount !== -1" />
          <no-result v-show="singerCount === -1" />
        </div>
      </pagination>
      <pagination
        v-if="currentPage === 'mv'"
        :flag="flag"
        :total="mvCount"
        :page="mvPage"
        :size="15"
        @current-change="handlePage"
        @prev-click="changePage(mvPage - 1)"
        @next-click="changePage(mvPage + 1)"
      >
        <div v-if="flag" slot="content">
          <mv-list v-show="mvs.length > 0" :mvs="mvs" route="search" />
        </div>
        <div v-show="mvs.length === 0" ref="loading" slot="loading" style="flex: 1">
          <loading />
        </div>
      </pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import NoResult from '../../components/noResult/noResult'
import songList from '../../components/songlist/songlist'
import Loading from '../../components/Loading/Loading'
import pagination from '../../components/pagination/pagination'
import DiscList from '../../components/DiscList/DiscList'
import SingerList from '../../components/singerlist/singerlist'
import MvList from '../../components/MvList/MvList'
import { searchSong, searchSinger, searchAlbum, searchDisc, searchMV } from '../../api/index/search'
import { saveSearchHistory } from '../../assets/js/cache'

export default {
  name: 'Search',
  components: { songList, Loading, pagination, DiscList, SingerList, NoResult, MvList },
  data() {
    return {
      currentPage: 'song',
      songPage: 0,
      songCount: 0,
      albumPage: 0,
      albumCount: 0,
      singerPage: 0,
      singerCount: 0,
      discPage: 0,
      discCount: 0,
      mvPage: 0,
      mvCount: 0,
      songs: [],
      albums: [],
      singers: [],
      discs: [],
      mvs: [],
      route: '',
      flag: true
    }
  },
  computed: {
    query() {
      return this.$route.query.keywords
    }
  },
  watch: {
    currentPage(newPage) {
      if (newPage === 'singer' && this.singerPage === 0 && this.singers.length === 0) {
        this.singerResult(1)
      } else if (newPage === 'disc' && this.discPage === 0 && this.discs.length === 0) {
        this.discResult(1)
      } else if (newPage === 'album' && this.albumPage === 0 && this.albums.length === 0) {
        this.albumResult(1)
      } else if (newPage === 'mv' && this.mvPage === 0 && this.mvs.length === 0) {
        this.mvResult(1)
      }
    },
    query(newQuery, oldQuery) {
      if (!newQuery || newQuery === oldQuery || (newQuery && newQuery.length === 0)) {
        return
      }
      setTimeout(() => {
        if (this.route.match('search') && this.route !== 'search') {
          return
        }
        this.setSearchHistory(saveSearchHistory(newQuery))
        this.songPage = 0
        this.songCount = 0
        this.albumPage = 0
        this.albumCount = 0
        this.singerPage = 0
        this.singerCount = 0
        this.discPage = 0
        this.discCount = 0
        this.songs = []
        this.albums = []
        this.singers = []
        this.discs = []
        this.handlePage(1)
      }, 20)
    },
    $route(n, o) {
      this.route = o.name
    }
  },
  activated() {
    if (this.route.match('search') && this.route !== 'search') {
      return
    }
    this.init()
    this.songResult(1)
    this.setSearchHistory(saveSearchHistory(this.query))
  },
  methods: {
    init() {
      this.currentPage = 'song'
      this.songPage = 0
      this.songCount = 0
      this.albumPage = 0
      this.albumCount = 0
      this.singerPage = 0
      this.singerCount = 0
      this.discPage = 0
      this.discCount = 0
      this.mvPage = 0
      this.mvCount = 0
      this.songs = []
      this.albums = []
      this.singers = []
      this.discs = []
      this.mvs = []
    },
    hiddenMenu() {
      this.$refs.songlist && this.$refs.songlist.hiddenMenu()
    },
    changePage(page) {
      if (this.currentPage === 'song') {
        this.songPage = page
      } else if (this.currentPage === 'album') {
        this.albumPage = page
      } else if (this.currentPage === 'disc') {
        this.discPage = page
      } else if (this.currentPage === 'singer') {
        this.singerPage = page
      }
    },
    handlePage(page) {
      if (this.currentPage === 'song') {
        this.songResult(page)
      } else if (this.currentPage === 'album') {
        this.albumResult(page)
      } else if (this.currentPage === 'disc') {
        this.discResult(page)
      } else if (this.currentPage === 'singer') {
        this.singerResult(page)
      } else if (this.currentPage === 'mv') {
        this.mvResult(page)
      }
    },
    changeCurPage(page) {
      this.currentPage = page
    },
    async songResult(page) {
      this.songs = []
      const { song, count } = await searchSong(this.query, page)
      this.songs = song
      this.songCount = count
      this.songPage = page
    },
    async albumResult(page) {
      this.albums = []
      const { album, count } = await searchAlbum(this.query, page - 1)
      this.albums = album
      this.albumCount = count
      this.albumPage = page
    },
    async discResult(page) {
      this.discs = []
      const { disc, count } = await searchDisc(this.query, page - 1)
      this.discs = disc
      this.discCount = count
      this.discPage = page
    },
    async singerResult(page) {
      this.singers = []
      const { singer, count } = await searchSinger(this.query, page - 1)
      this.singers = singer
      this.singerCount = count
      this.singerPage = page
    },
    async mvResult(page) {
      this.mvs = []
      const { mv, total } = await searchMV(this.query, page - 1)
      this.mvs = mv
      this.mvCount = total
      this.mvPage = page
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
  .search
    height 100%
    position relative
    .nav
      background $color-background-d
      position absolute
      top 0
      left 0
      height 40px
      display flex
      border-bottom 2px solid $color-background
      padding 0 20px
      width 100%
      box-sizing border-box
      li
        line-height 40px
        margin-right 40px
        padding 0 5px
        font-size $font-size-medium
        transition all .2s
        &.active
          border-bottom 2px solid $color-theme
          color $color-theme
        &:hover
          color $color-theme
          border-bottom 2px solid $color-theme
          cursor pointer
        &:active
          transform translate3d(1px, 1px, 0)
    .search-result
      position absolute
      top 40px
      bottom 0
      width 100%
      overflow-x hidden
      overflow-y scroll
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar
        display: none; /* Chrome Safari */
</style>

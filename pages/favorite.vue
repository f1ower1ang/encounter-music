<template>
  <div class="favorite" @click="hiddenMenu" @scroll="hiddenMenu">
    <div class="top">
      <p class="title">
        我喜欢
      </p>
      <ul class="nav">
        <li :class="{ active: currentPage === 'song' }" @click="changeCurPage('song')">
          歌曲{{ favoriteList.length }}
        </li>
        <li :class="{ active: currentPage === 'disc' }" @click="changeCurPage('disc')">
          歌单{{ discLength }}
        </li>
        <li :class="{ active: currentPage === 'album' }" @click="changeCurPage('album')">
          专辑{{ albumLength }}
        </li>
      </ul>
    </div>
    <div class="content-wrapper">
      <transition name="slide">
        <div v-show="currentPage==='song'">
          <el-row v-show="favoriteList.length !== 0" style="padding: 0 20px; line-height: 50px">
            <el-button
              icon="icon-mini-play"
              style="padding: 8px 15px;"
              @click.native.stop="allPlay({ list: favoriteList })"
            >
              全部播放
            </el-button>
          </el-row>
          <song-list v-show="favoriteList.length !== 0" ref="songlist" :songs="favoriteList" />
          <no-result v-show="favoriteList.length === 0" style="margin-top:20%" msg="没有收藏的歌曲" />
        </div>
      </transition>
      <transition name="slide">
        <div v-show="currentPage==='disc'">
          <disc-list v-show="discLength !== 0" style="padding: 0 20px; box-sizing: border-box" :discs="favorDiscList" :flag="false" type="disc" />
          <no-result v-show="discLength === 0" style="margin-top:20%" msg="没有收藏的歌单" />
        </div>
      </transition>
      <transition name="slide">
        <div v-show="currentPage==='album'">
          <disc-list v-show="albumLength !== 0" style="padding: 0 20px; box-sizing: border-box" :discs="favorAlbumList" :flag="false" type="album" />
          <no-result v-show="albumLength === 0" style="margin-top:20%" msg="没有收藏的专辑" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import SongList from '../components/songlist/songlist'
import DiscList from '../components/DiscList/DiscList'
import NoResult from '../components/noResult/noResult'
import { loadFavorite, loadFavorDisc, loadFavorAlbum } from '../assets/js/cache'

export default {
  name: 'Favorite',
  components: { SongList, DiscList, NoResult },
  transition: 'test',
  data() {
    return {
      currentPage: 'song'
    }
  },
  computed: {
    discLength() {
      return this.favorDiscList.length
    },
    albumLength() {
      return this.favorAlbumList.length
    },
    ...mapGetters([
      'favoriteList',
      'favorDiscList',
      'favorAlbumList'
    ])
  },
  mounted() {
    this.setFavorite(loadFavorite())
    this.setFavorDisc(loadFavorDisc())
    this.setFavorAlbum(loadFavorAlbum())
  },
  methods: {
    changeCurPage(page) {
      this.currentPage = page
    },
    hiddenMenu() {
      this.$refs.songlist.hiddenMenu()
    },
    ...mapMutations({
      setFavorite: 'SET_FAVORITE_LIST',
      setFavorDisc: 'SET_FAVOR_DISC_LIST',
      setFavorAlbum: 'SET_FAVOR_ALBUM_LIST'
    }),
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/stylus/variable.styl"
  .favorite
    overflow auto
    height 100%
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
    .top
      background $color-background-d
      height 100px
      .title
        line-height 60px
        font-size $font-size-large-x
        font-weight: bold
        padding 0 20px
      .nav
        height 40px
        display flex
        border-bottom 2px solid $color-background
        padding 0 20px
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
    .content-wrapper
      .slide-enter-active
        transition all .3s linear
        opacity: 0.5
      .slide-enter
        transform translate3d(-20px, 0, 0)
        .no-result, .discList, .list-content
          display none
  .el-button
    &:hover, &:active, &:focus
      color $color-text
</style>

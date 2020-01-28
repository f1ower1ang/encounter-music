<template>
  <div class="album-wrapper" @click="hiddenMenu" @scroll="hiddenMenu">
    <div v-if="songs.length > 0" class="album">
      <div class="top">
        <div class="img">
          <img v-lazy="imgObj" alt="" height="140" style="object-fit: cover">
        </div>
        <div class="info">
          <h2 class="title">
            {{ name }}
          </h2>
          <p class="singer">
            {{ singer }}
          </p>
          <p class="desc">
            {{ time }}发行 <span style="padding-left: 20px">{{ tag }}</span>
          </p>
          <el-row class="option">
            <el-button icon="icon-mini-play" type="success" @click.native="allPlay({ list: songs })">
              播放全部
            </el-button>
            <el-button :icon="isFavorite() ? 'icon-favorite': 'icon-not-favorite'" @click.stop="toggleFavor">
              收藏
            </el-button>
          </el-row>
        </div>
      </div>
      <song-list ref="songlist" :songs="songs" :num="num" />
    </div>
    <div v-if="songs.length === 0" class="loading">
      <loading />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { albumSong } from '../api/index/singer'
import SongList from '../components/songlist/songlist'
import Loading from '../components/Loading/Loading'
import { saveFavorAlbum, deleteFavorAlbum, merge } from '../assets/js/cache'

export default {
  name: 'Album',
  components: { SongList, Loading },
  data() {
    return {
      songs: [],
      name: '',
      imgUrl: '',
      tag: '',
      time: '',
      singer: '',
      num: 0
    }
  },
  computed: {
    imgObj() {
      return {
        src: this.$route.query.type === 'nt' ? this.imgUrl + '?param=200y200' : this.imgUrl,
        loading: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000',
        error: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'
      }
    },
    ...mapGetters([
      'favorAlbumList'
    ])
  },
  mounted() {
    this.toggleFavor = function () {
      const album = {
        name: this.name,
        count: this.songs.length,
        imgUrl: this.imgUrl,
        type: this.$route.query.type,
        id: this.$route.query.id,
        creator: this.singer
      }
      if (this.isFavorite()) {
        this.setFavorAlbum(deleteFavorAlbum(album))
      } else {
        this.setFavorAlbum(saveFavorAlbum(album))
      }
    }
  },
  async activated() {
    this.songs = []
    this.name = ''
    this.imgUrl = ''
    this.tag = ''
    this.time = ''
    this.singer = ''
    let res = await albumSong(this.$route.query.id, this.$route.query.type)
    res = res.albumInfo
    this.songs = res.songs
    this.name = res.name
    this.imgUrl = res.imgUrl
    this.tag = res.tag
    this.time = res.time
    this.singer = res.singer
    this.num = res.num
  },
  methods: {
    hiddenMenu() {
      this.$refs.songlist.hiddenMenu()
    },
    isFavorite() {
      return merge(this.favorAlbumList).findIndex(album => album.id === this.$route.query.id) !== -1
    },
    handlePlayList(playList) {
      this.$refs.content.style.paddingBottom = playList.length > 0 ? '60px' : ''
    },
    ...mapMutations({
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
  @import "../assets/stylus/mixin.styl"
  .album-wrapper
    height 100%
    overflow-x hidden
    overflow-y scroll
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
  .album
    .top
      padding 20px 20px
      height 140px
      display flex
      align-items center
      .img
        padding-right 20px
        width 140px
        height 140px
      .info
        flex 1
        flex-direction column
        display flex
        height 100%
        .title
          font-weight bold
          font-size 25px
          padding-bottom 5px
          width 80%
        .singer
          line-height 30px
          width 80%
          font-size $font-size-medium
        .desc
          line-height 30px
          height 25px
          flex 1
          font-size $font-size-medium
          color $color-text-d
          width 100%
        .option
          .el-button
            font-size $font-size-medium
            padding: 8px 15px;
            &:hover, &:active, &:focus
              color $color-text
            &.el-button--success
              background $color-theme
              border-color $color-theme
              color $color-text
    .list-content
      padding 0 20px
      .el-row
        height 43px
        line-height 40px
        font-size $font-size-medium
        border-bottom 1px solid rgb(239, 239, 239)
        no-wrap()
        .icon
          margin-right 5px
          font-weight lighter
          opacity 0
          &:last-child
            margin-right 0
          &:hover
            cursor pointer
            color $color-theme
        .el-col-11
          no-wrap()
          .icon
            opacity 1
        .el-col-4
          no-wrap()
        .el-col-3
          no-wrap()
      .item
        &:hover
          background rgba(239, 239, 239, .5)
          .icon
            opacity 1
  .loading
    margin-top 30%
    width 100%
    height cal(100% - 80px)
    text-align center
</style>

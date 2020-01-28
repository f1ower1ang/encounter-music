<template>
  <div class="disc-song" @scroll="hiddenMenu">
    <div v-if="songs.length > 0" class="category-detail" @click="hiddenMenu">
      <div class="top">
        <div class="img">
          <img v-lazy="imgObj" alt="" height="140" width="140" style="object-fit: cover">
        </div>
        <div class="info">
          <h2 class="title" v-html="disc.name" />
          <p class="tag" v-html="tag" />
          <div class="desc">
            <div class="easy">
              <el-row v-html="desc" />
            </div>
            <i @click.stop="open">[详情]</i>
            <div ref="desc" class="all" @click.stop>
              <p style="padding: 0 50px 0 20px" v-html="desc" />
              <p style="text-align: right; line-height: 40px; padding-right: 20px" @click="close">
                [收起]
              </p>
            </div>
          </div>
          <el-row class="option">
            <el-button icon="icon-mini-play" type="success" @click="allPlay({ list: songs })">
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
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { getDiscSong } from '../../api/index/recommend'
import loading from '../../components/Loading/Loading'
import songList from '../../components/songlist/songlist'
import { saveFavorDisc, merge, deleteFavorDisc } from '../../assets/js/cache'

export default {
  name: 'Discat',
  components: { loading, songList },
  data() {
    return {
      tag: '',
      desc: '',
      num: 0,
      creator: '',
      songs: [],
      disc: {}
    }
  },
  computed: {
    imgObj() {
      return {
        src: this.disc.imgUrl,
        loading: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000',
        error: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'
      }
    },
    ...mapGetters([
      'favorDiscList'
    ])
  },
  activated() {
    this.imgUrl = ''
    this.name = ''
    this.tag = ''
    this.desc = ''
    this.songs = []
    this.getSong()
  },
  mounted() {
    this.toggleFavor = function () {
      if (this.isFavorite()) {
        this.setFavorDisc(deleteFavorDisc(this.disc))
      } else {
        this.setFavorDisc(saveFavorDisc(this.disc))
      }
    }
  },
  methods: {
    hiddenMenu() {
      this.$refs.songlist.hiddenMenu()
      this.close()
    },
    isFavorite() {
      return merge(this.favorDiscList).findIndex(disc => disc.discId === this.$route.query.id) !== -1
    },
    collect() {
      this.setFavorDisc(saveFavorDisc(this.disc))
    },
    open() {
      if (this.$refs.desc) {
        this.$refs.desc.style.display = 'block'
      }
    },
    close() {
      if (this.$refs.desc) {
        this.$refs.desc.style.display = 'none'
      }
    },
    async getSong() {
      const res = await getDiscSong(this.$route.query.id, this.$route.query.type)
      const discSong = res.discSong
      discSong.tag.forEach((e) => {
        this.tag += `#${e.name} `
      })
      this.num = discSong.count
      this.desc = discSong.desc
      this.songs = discSong.songs
      this.disc = {
        name: discSong.name,
        imgUrl: discSong.imgUrl,
        count: discSong.songs.length,
        creator: discSong.creator,
        type: this.$route.query.type,
        discId: this.$route.query.id
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
    ...mapMutations({
      setFavorDisc: 'SET_FAVOR_DISC_LIST'
    }),
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  @import "../../assets/stylus/mixin.styl"
  .disc-song
    overflow: auto;
    height: 100%;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
  .category-detail
    .top
      padding 20px 20px
      height 140px
      display flex
      align-items center
      background $color-background-d
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
          padding-bottom 15px
          font-size 25px
          width 80%
        .tag
          line-height 25px
          width 80%
          font-size $font-size-medium
        .desc
          line-height 25px
          position relative
          height 25px
          flex 1
          z-index 1
          font-size $font-size-medium
          color $color-text-d
          width 100%
          .easy
            height 25px
            width 80%
            position absolute
            .el-row
              width 100%
              height 100%
              no-wrap()
          i
            position absolute
            font-style normal
            right 50px
            top 0
          .all
            display none
            position absolute
            left -20px
            right 0
            top 0
            background #fff
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
    width 100%
    height 100%
    text-align center
</style>

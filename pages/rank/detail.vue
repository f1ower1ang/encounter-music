<template>
  <div class="rank-detail">
    <div>
      <template v-if="song.length > 0">
        <div class="top">
          <div class="left">
            <img v-lazy="imgObj" alt="" width="100%">
          </div>
          <div class="right">
            <p class="title">
              {{ name }}
            </p>
            <p class="time">
              {{ updateTime }}更新
            </p>
            <el-row>
              <el-button icon="icon-mini-play" type="success" @click="allPlay({ list: song })">
                播放全部
              </el-button>
            </el-row>
          </div>
        </div>
        <div class="list-content">
          <song-list :rank="rank" :songs="song" />
        </div>
      </template>
    </div>
    <div v-show="song.length === 0" ref="loading" class="loading">
      <loading />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getRankSong } from '../../api/index/rank'
import songList from '../../components/songlist/songlist'
import Loading from '../../components/Loading/Loading'

export default {
  name: 'Detail',
  components: { songList, Loading },
  data() {
    return {
      name: '',
      updateTime: '',
      song: []
    }
  },
  computed: {
    imgObj() {
      return {
        src: this.song[0].imgUrl,
        loading: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000',
        error: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'
      }
    },
    ...mapGetters([
      'playList'
    ])
  },
  async activated() {
    this.song = []
    const query = this.$route.query
    this.name = query.name
    this.rank = true
    const res = await getRankSong(query.id, query.type)
    this.updateTime = res.updateTime
    this.song = res.song
  },
  methods: {
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
  .rank-detail
    height 100%
    overflow auto
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
        display flex
        height 140px
        flex-direction column
        .title
          font-size $font-size-large-x
          font-weight bold
        .time
          font-size $font-size-medium
          color $color-text-d
          flex 1
          line-height 20px
          margin-top 15px
        .el-button
          font-size $font-size-medium
          padding: 8px 15px
          &.el-button--success
            background $color-theme
            border-color $color-theme
            color $color-text
    .loading
      width 100%
      height 100%
</style>

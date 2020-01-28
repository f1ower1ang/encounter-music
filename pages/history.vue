<template>
  <div class="history" @click="hiddenMenu" @scroll="hiddenMenu">
    <div class="top">
      <p class="title">
        播放历史
      </p>
      <p class="count">
        共{{ playHistory.length }}首
      </p>
    </div>
    <el-row v-show="playHistory.length > 0" style="padding: 0 20px; line-height: 50px">
      <el-button
        icon="icon-mini-play"
        style="padding: 8px 15px;"
        @click.native="allPlay({ list: playHistory })"
      >
        全部播放
      </el-button>
    </el-row>
    <song-list v-show="playHistory.length > 0" ref="songlist" type="history" :show-del="true" :songs="playHistory" />
    <div v-show="playHistory.length === 0" style="height: 50%; margin-top: 20%">
      <no-result msg="暂无播放记录" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { loadPlayHistory } from '../assets/js/cache'
import SongList from '../components/songlist/songlist'
import NoResult from '../components/noResult/noResult'

export default {
  name: 'History',
  components: { SongList, NoResult },
  transition: 'test',
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  mounted() {
    this.setPlayHistory(loadPlayHistory())
  },
  methods: {
    hiddenMenu() {
      this.$refs.songlist.hiddenMenu()
    },
    ...mapMutations({
      setPlayHistory: 'SET_PLAY_HISTORY'
    }),
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/stylus/variable.styl"
  .history
    height 100%
    overflow auto
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
    .top
      background $color-background-d
      height 100px
      padding 0 20px
      .title
        line-height 60px
        font-size $font-size-large-x
        font-weight: bold
      .count
        line-height 20px
        font-size $font-size-medium
  .el-button
    &:hover, &:active, &:focus
      color $color-text
</style>

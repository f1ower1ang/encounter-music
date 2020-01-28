<template>
  <m-content>
    <m-block>
      <template v-show="rank.length > 1">
        <div v-for="(list, index) in rank" :key="index" class="rank-wrapper">
          <p class="title">
            {{ list.title }}
          </p>
          <el-row v-for="(item, idx) in list.list" :key="idx" class="rank-row">
            <el-col v-for="(del, key) in item" :key="key" :span="8" class="rank-item" @click.native="selectRank(del)">
              <div class="left">
                <img v-lazy="del.imgUrl" alt="" width="130">
                <p>
                  <i class="icon-listen" />
                  {{ playNum(del.listenNum) }}
                </p>
                <div class="filter">
                  <i class="icon-playbtn" @click.stop="playRankSong(del)" />
                </div>
              </div>
              <div class="right">
                <ul class="rank-song">
                  <li v-for="(song, ix) in del.songList" :key="ix" class="song">
                    <span style="color:#5e5e5e; font-size: 12px">{{ ix + 1 }}</span> {{ song.song }} <span style="color:#5e5e5e">- {{ song.singer }}</span>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <div v-show="rank.length === 0" ref="loading" class="loading">
        <loading />
      </div>
    </m-block>
  </m-content>
</template>

<script>
import { mapActions } from 'vuex'
import MContent from '../../components/Content/Content'
import MBlock from '../../components/Block/Block'
import Loading from '../../components/Loading/Loading'
import { getRank, getRankSong } from '../../api/index/rank'

export default {
  components: { MContent, MBlock, Loading },
  transition: 'slide',
  data() {
    return {
      rank: [{
        title: '',
        list: []
      }]
    }
  },
  async asyncData() {
    const { qqList, ntList } = await getRank()
    const qq = []
    let index = 0
    while (index + 3 < qqList.length) {
      qq.push(qqList.slice(index, index + 3))
      index += 3
    }
    if (index < qqList.length) {
      qq.push(qqList.slice(index))
    }
    return {
      rank: [{
        title: '云音乐',
        list: [ntList.slice(0, 3), ntList.slice(3)]
      }, {
        title: '巅峰榜',
        list: qq
      }]
    }
  },
  methods: {
    async playRankSong(rank) {
      const { song } = await getRankSong(rank.id, rank.type)
      this.allPlay({ list: song })
    },
    playNum(num) {
      return num.toString().length > 3 ? Number(num / 10000).toFixed(1) + '万' : num
    },
    selectRank(item) {
      this.$router.push(`/rank/detail?id=${item.id}&type=${item.type}&name=${item.name}`)
    },
    ...mapActions([
      'allPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  @import "../../assets/stylus/mixin.styl"
  .title
    font-size $font-size-large-x
    font-weight bold
    padding-top 20px
    padding-bottom 40px
  .rank-wrapper
    padding-bottom 20px
    .rank-row
      margin-top 5px
      margin-bottom 10px
      height 130px
      .rank-item
        display flex
        height 100%
        .left
          position relative
          height 130px
          flex 0 0 130px
          background rgba(0,0,0,.2)
          &:hover
            .filter
              opacity 1
          p
            position absolute
            left 5px
            bottom 5px
            font-size $font-size-small
            color #fff
          .filter
            position absolute
            transition all .2s
            left 0
            top 0
            width 100%
            height 100%
            background rgba(0, 0, 0, .2)
            opacity 0
            .icon-playbtn
              position absolute
              top 50%
              left 50%
              transform translate(-50%, -50%)
              font-size 35px
              color #fff
              transition all .2s
              &:hover
                color $color-theme
                cursor pointer
        .right
          flex 1
          height 100%
          overflow hidden
          .rank-song
            padding-left 10px
            display flex
            flex-direction column
            width 90%
            height 100%
            justify-content center
            background $color-background
            transition all .2s
            &:hover
              background rgba(0, 0, 0, .1)
            .song
              no-wrap()
              width 90%
              line-height 35px
              font-size $font-size-medium
              color $color-text-l
  .loading
    width 100%
</style>

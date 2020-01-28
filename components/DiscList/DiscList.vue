<template>
  <div ref="disclist" class="discList">
    <el-row class="row" :gutter="13" style="padding-bottom: 0">
      <el-col
        v-for="(disc, idx) in discs"
        :key="idx"
        :lg="4"
        :sm="6"
        :xs="12"
        class="item"
      >
        <div class="img">
          <img ref="img" v-lazy="imgObj(disc)" alt="">
          <p v-if="type === 'disc' && flag" class="num" style="line-height: 14px">
            <i class="el-icon-headset" style="padding-right: 0" />
            {{ formalizeNum(disc.listenNum) }}
          </p>
          <p v-else-if="type === 'album' && flag" class="num">
            {{ disc.time }}
          </p>
          <p v-if="!flag" class="num">
            {{ disc.count }}首
          </p>
          <div class="filter" @click="selectDisc(disc)">
            <i class="icon-playbtn" @click.stop="play(disc)" />
          </div>
        </div>
        <div class="state" @click="selectDisc(disc)">
          <el-row class="name">
            <el-col :span="!flag ? 20: 24" v-html="disc.name" />
            <el-col :span="4" style="text-align: right">
              <i v-if="!flag" class="el-icon-delete" @click.stop="deleteItem(disc)" />
            </el-col>
          </el-row>
          <p class="creator" v-html="disc.creator" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { getDiscSong } from '../../api/index/recommend'
import { albumSong } from '../../api/index/singer'
import { deleteFavorDisc, deleteFavorAlbum } from '../../assets/js/cache'

export default {
  name: 'DiscList',
  props: {
    discs: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'disc'
    },
    flag: {
      type: Boolean,
      default: true
    },
    route: {
      type: String,
      default: 'others'
    }
  },
  methods: {
    imgObj(disc) {
      return {
        src: disc.type === 'nt' ? disc.imgUrl + '?param=300y300' : disc.imgUrl,
        loading: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000',
        error: 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'
      }
    },
    formalizeNum(num) {
      if (num.toString().length >= 4) {
        return Number(num / 10000).toFixed(1) + '万'
      } else {
        return num
      }
    },
    deleteItem(item) {
      if (this.type === 'disc') {
        this.setFavorDisc(deleteFavorDisc(item))
      } else if (this.type === 'album') {
        this.setFavorAlbum(deleteFavorAlbum(item))
      }
    },
    selectDisc(item) {
      if (this.route === 'search') {
        if (this.type === 'album') {
          this.$router.push(`/search/album?id=${item.id}&type=${item.type}`)
        } else {
          this.$router.push(`/search/discSong?id=${item.discId}&type=${item.type}`)
        }
      } else if (this.type === 'album') {
        this.$router.push(`/album?id=${item.id}&type=${item.type}`)
      } else {
        this.$router.push(`/discSong?id=${item.discId}&type=${item.type}`)
      }
    },
    async play(item) {
      if (this.type === 'album') {
        const { albumInfo } = await albumSong(item.id, item.type)
        this.allPlay({ list: albumInfo.songs })
      } else {
        const { discSong } = await getDiscSong(item.discId, item.type)
        this.allPlay({ list: discSong.songs })
      }
    },
    ...mapMutations({
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
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
  .discList
    width 100%
    .row
      margin-top 25px
      &:first-child
        margin-top 0
        padding-top 25px
      &:last-child
        padding-bottom 30px
      .item
        transition all .4s
        padding-right 20px
        padding-bottom 20px
        .img
          position relative
          width 100%
          height 0
          padding-bottom 100%
          img
            position absolute
            width 100%
            height 100%
            object-fit cover
          &:hover
            cursor pointer
          .filter
            position absolute
            top 0
            left 0
            height 0
            padding-bottom 100%
            width 100%
            background rgba(0,0,0, .2)
            opacity 0
            transition all .2s
            &:hover
              opacity 1
            .icon-playbtn
              position absolute
              bottom 5px
              right 0
              font-size 30px
              color $color-text-l
              transition all .2s
              &:hover
                color $color-theme
          .num
            position absolute
            padding 2px 0 5px 5px
            width 100%
            box-sizing border-box
            bottom 0
            left 0
            color $color-text-l
            font-size $font-size-small
            background linear-gradient(to top, rgba(128, 138, 135, 0.5) 0%, rgba(128, 138, 135, 0) 100%)
        .state
          margin-top 10px
          no-wrap()
          .name
            line-height 25px
            transition all .2s
            color $color-text-l
            font-size $font-size-medium
            font-weight lighter
            .el-col
              no-wrap()
            .el-icon-delete
              opacity 0
              transition all .2s
              &:hover
                color $color-theme
          .creator
            line-height 20px
            transition all .2s
            color $color-text-d
            font-size $font-size-small
            no-wrap()
          &:hover
            cursor pointer
            .el-col:first-child, .creator
              color $color-theme
            .el-icon-delete
              opacity 1
</style>

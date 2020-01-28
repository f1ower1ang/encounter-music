<template>
  <div class="singerList">
    <el-row class="list" tag="ul">
      <el-col
        v-for="(singer, idx) in singers"
        :key="idx"
        :xs="12"
        :sm="6"
        :md="4"
        :lg="3"
        class="item"
        tag="li"
      >
        <div class="singer">
          <img v-lazy="imgObj(singer)" alt="" width="70%" style="border-radius: 50%" @click="selectSinger(singer)">
          <p @click="selectSinger(singer)" v-html="singer.singer" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Singerlist',
  props: {
    singers: {
      type: Array,
      default: null
    },
    route: {
      default: 'others',
      type: String
    }
  },
  methods: {
    imgObj(singer) {
      return {
        src: singer.imgUrl,
        error: 'http://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000'
      }
    },
    selectSinger(singer) {
      if (this.route === 'search') {
        this.$router.push(`/search/singer?id=${singer.id}&type=${singer.type}`)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .singerList
    width 100%
    .list
      margin-top 20px
      .item
        text-align center
        &:after
          width 100%
          padding-bottom 100%
        .singer
          width 100%
          padding-bottom 100%
          height 0
          margin 0 auto
          img:hover
            cursor pointer
          p
            margin-top 10px
            font-size $font-size-medium
            transition all .2s
            &:hover
              color $color-theme
              cursor pointer
</style>

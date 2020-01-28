<template>
  <div class="mvList">
    <el-row :gutter="13" class="row">
      <el-col
        v-for="(mv, index) in mvs"
        :key="index"
        :lg="4"
        :sm="6"
        :xs="12"
        class="item"
      >
        <div class="img">
          <img ref="img" v-lazy="imgObj(mv)" alt="">
          <div class="filter" @click="selectMv(mv)">
            <i class="icon-playbtn" />
          </div>
          <p v-if="mv.publishTime" class="time">
            {{ mv.publishTime }}
          </p>
          <p v-if="mv.playNum" class="play-num">
            <i class="icon-video-num"></i>
            {{ playNum(mv.playNum) }}
          </p>
        </div>
        <div class="state" @click="selectMv(mv)" v-html="mv.name" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MvList',
  props: {
    mvs: {
      type: Array,
      default: null
    },
    route: {
      type: String,
      default: 'others'
    }
  },
  methods: {
    selectMv(mv) {
      if (this.route === 'search') {
        this.$router.push(`/search/mv?id=${mv.id}&type=${mv.type}`)
      } else {
        this.$router.push(`/mv?id=${mv.id}&type=${mv.type}`)
      }
    },
    playNum(num) {
      return num.toString().length > 5 ? (num / 10000).toFixed(1) + '万' : num
    },
    imgObj(mv) {
      return {
        src: mv.imgUrl,
        loading: 'https://y.gtimg.cn/mediastyle/global/img/mv_300.png?max_age=31536000',
        error: 'https://y.gtimg.cn/mediastyle/global/img/mv_300.png?max_age=31536000'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
  .row
    padding 0 20px
    box-sizing border-box
    margin-top 20px
    .item
      padding-bottom 15px
      transition all .2s
      .img
        position relative
        width 100%
        height 0
        padding-bottom 70%
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
          padding-bottom 70%
          width 100%
          background rgba(0,0,0, .2)
          opacity 0
          transition all .2s
          &:hover
            opacity 1
          .icon-playbtn
            position absolute
            left 50%
            top 50%
            transform translate3d(-50%, -50%, 0)
            font-size 40px
            color $color-text-l
            padding 0
            transition all .2s
            &:hover
              color $color-theme
        .time, .play-num
          position absolute
          left 0
          bottom 0
          padding 2px 0 5px 5px
          width 100%
          box-sizing border-box
          color $color-text-l
          font-size $font-size-small-s
          background linear-gradient(to top, rgba(128, 138, 135, 0.5) 0%, rgba(128, 138, 135, 0) 100%)
      .state
        margin-top 10px
        font-size $font-size-small-x
        line-height 20px
        height 40px
        transition all .2s
        overflow:hidden;
        text-overflow:ellipsis
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        &:hover
          cursor pointer
          color $color-theme
</style>

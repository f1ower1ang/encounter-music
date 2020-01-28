<template>
  <div class="tab-wrapper">
    <ul class="tab">
      <nuxt-link v-for="(item,index) in routers" :key="index" class="item" tag="li" :to="item.router">
        <p>{{ item.name }}</p>
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routers: [{
        router: '/',
        name: '精选'
      }, {
        router: '/singer',
        name: '歌手'
      }, {
        router: '/rank',
        name: '排行'
      }, {
        router: 'disc',
        name: '分类歌单'
      }]
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
  .tab-wrapper
    position absolute
    background $color-background-l
    top 0
    left 0
    right 0
    height 32px
    z-index 1
    .tab
      height 32px
      position absolute
      left 50%
      transform translateX(-50%)
      .item
        float left
        margin-right 50px
        line-height 30px
        text-align: center
        transition all .2s
        &:hover
          color $color-theme
          border-bottom 2px solid $color-theme
          cursor pointer
        p
          font-size $font-size-medium
        &:last-child
          margin-right 0
        &.nuxt-link-exact-active
          border-bottom 2px solid $color-theme
          p
            color $color-theme
</style>

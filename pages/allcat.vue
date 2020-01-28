<template>
  <div ref="cat" class="allCat">
    <div style="padding: 0 20px">
      <p class="title">
        全部分类
      </p>
      <div v-for="(cat,index) in cats" :key="index" class="list">
        <div class="type">
          <i :class="getIcon(cat.title)" style="font-size: 40px; color: rgba(0, 0, 0, .1)" />
          <p>{{ cat.title }}</p>
        </div>
        <div v-for="(item, idx) in cat.items" :key="idx" class="item" @click="selectCat(item)" v-html="item.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { getDicCat } from '../api/index/recommend'

export default {
  name: 'Allcat',
  data() {
    return {
      cats: []
    }
  },
  async asyncData() {
    const { dicCat } = await getDicCat()
    return {
      cats: dicCat
    }
  },
  methods: {
    selectCat(cat) {
      this.$router.push(`/discat?id=${cat.id}&name=${cat.name}`)
    },
    getIcon(icon) {
      let iconstr = 'icon-'
      switch (icon) {
        case '语种':
          iconstr += 'language'
          break
        case '流派':
          iconstr += 'style'
          break
        case '主题':
          iconstr += 'theme'
          break
        case '心情':
          iconstr += 'motion'
          break
        case '场景':
          iconstr += 'scene'
          break
      }
      return iconstr
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/stylus/variable.styl"
  .allCat
    box-sizing border-box
    height 100%
    overflow auto
    background linear-gradient($color-background-d, $color-background-l)
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
    .title
      line-height 80px
      font-size $font-size-large
      color $color-text-d
    .list
      width 100%
      margin-bottom 10px
      clear left
      height 100px
      text-align center
      font-size $font-size-medium
      .type
        height 100px
        width 11.1111%
        float left
        line-height 60px
        box-sizing border-box
        border-right 1px solid transparent
        border-bottom 1px solid transparent
        background $color-background-l
        p
          line-height 10px
          font-size $font-size-medium-x
      .item
        box-sizing border-box
        float left
        height 50px
        line-height 50px
        width 11.1111%
        border-right 1px solid transparent
        border-bottom 1px solid transparent
        background $color-background-l
        transition all .2s
        &:hover
          background $color-border

</style>

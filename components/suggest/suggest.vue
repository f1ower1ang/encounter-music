<template>
  <div ref="parent" class="suggest">
    <dl v-for="(list, index) in result" :key="index" style="width: 100%">
      <dt class="title">
        {{ list.title }}
      </dt>
      <dd v-for="(item, idx) in list.list" :key="idx" :class="list.type" @click="selectSuggest(list, item)">
        <img
          v-if="list.title === '歌手' || list.title === '歌单'"
          :src="item.imgUrl"
          height="40"
          width="40"
          :class="{circle: list.type ==='singer'}"
        >
        {{ item.name }}
      </dd>
    </dl>
  </div>
</template>

<script>
import { suggest } from '../../api/index/search'

export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: []
    }
  },
  watch: {
    async query(newQuery) {
      if (newQuery.length === 0) {
        return
      }
      const { ret } = await suggest(newQuery)
      this.result = ret
    }
  },
  mounted() {
    this.$refs.parent.style.left = `${window.innerWidth / 2 + 150 - (window.innerWidth - 50) * 0.2}px`
    window.onresize = () => {
      this.$refs.parent.style.left = `${window.innerWidth / 2 + 150 - (window.innerWidth - 50) * 0.2}px`
    }
  },
  methods: {
    selectSuggest(list, item) {
      this.$emit('select', item.name)
      if (list.type === 'song') {
        this.$router.push(`${list.path}?keywords=${item.name}`)
      } else {
        this.$router.push(`${list.path}?id=${item.id}&type=${item.type}`)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .suggest
    width 400px
    background #fff
    position fixed
    top 60px
    z-index 10
    box-shadow 0 0 5px 1px #ccc
    font-size $font-size-medium
    padding 0 5px
    box-sizing border-box
    color $color-text
    .title
      border-bottom: 1px solid $color-background-d
      line-height 30px
      padding 0 10px
      box-sizing border-box
      font-size $font-size-small
      color $color-text-d
      width 100%
    .song, .album
      width 100%
      line-height 30px
      padding 0 10px
      box-sizing border-box
      &:hover
        background $color-border
    .disc, .singer
      padding 0 10px
      box-sizing border-box
      width 100%
      height 50px
      display flex
      align-items center
      &:hover
        background $color-border
      img
        flex 0 0 40px
        margin-right 5px
        &.circle
          border-radius 50%
</style>

<template>
  <div ref="parent" class="hotKey-history">
    <dl class="hotKey">
      <dt class="title">
        <p class="left">
          热门搜索
        </p>
      </dt>
      <dd v-for="(k, index) in hotKeys" :key="index" class="item" @click.stop="select(k)">
        {{ k }}
      </dd>
    </dl>
    <dl class="history">
      <dt class="title">
        <p class="left">
          历史记录
        </p>
        <p class="right" :class="{dark: isNull }" @click="clearAll">
          清空
        </p>
      </dt>
      <dd v-for="(k, index) in searchHistory" :key="index" class="item" @click.stop="select(k)">
        {{ k }}
      </dd>
    </dl>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { loadSearchHistory, clearSearchHistory } from '../../assets/js/cache'
import { hotKey } from '../../api/index/search'

export default {
  name: 'HotKey',
  data() {
    return {
      hotKeys: []
    }
  },
  computed: {
    isNull() {
      return this.searchHistory && this.searchHistory.length === 0
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  mounted() {
    this.$refs.parent.style.left = `${window.innerWidth / 2 + 150 - (window.innerWidth - 50) * 0.2}px`
    window.onresize = () => {
      this.$refs.parent.style.left = `${window.innerWidth / 2 + 150 - (window.innerWidth - 50) * 0.2}px`
    }
    this.setSearchHistory(loadSearchHistory())
  },
  created() {
    hotKey().then((res) => {
      this.hotKeys = res
    })
  },
  methods: {
    select(key) {
      this.$emit('select', key)
      this.$router.push(`/search?keywords=${key}`)
    },
    clearAll() {
      if (this.isNull) {
        return
      }
      this.setSearchHistory(clearSearchHistory())
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    })
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
  .hotKey-history
    height 310px
    width 400px
    background #fff
    display flex
    position fixed
    top 60px
    z-index 10
    box-shadow 0 0 5px 1px #ccc
    font-size $font-size-medium
    color $color-text
    .hotKey
      flex 1
      width 100%
      padding 0 5px
      box-sizing border-box
      border-right 1px solid #ccc
      no-wrap()
    .history
      flex 1
      width 100%
      padding 0 5px
      box-sizing border-box
      no-wrap()
.title
    display flex
    line-height 30px
    padding 0 10px
    width 100%
    box-sizing border-box
    border-bottom 1px solid $color-background
    .left
      flex 1
    .right
      &:hover
        cursor pointer
      &.dark
        color $color-text-d
  .item
    line-height 27px
    padding 0 10px
    width 100%
    box-sizing border-box
    no-wrap()
    &:hover
      background $color-border
</style>

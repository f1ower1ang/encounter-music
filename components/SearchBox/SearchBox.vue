<template>
  <div class="search">
    <i class="icon-search" />
    <input
      ref="query"
      v-model="query"
      type="text"
      placeholder="搜索音乐、MV、歌单、歌手、专辑"
      @blur="blur"
      @focus="focus"
      @keypress="search"
    >
  </div>
</template>

<script>
import { debounce } from '../../assets/js/utils'

export default {
  name: 'SearchBox',
  data() {
    return {
      query: ''
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 250))
  },
  methods: {
    blur() {
      this.$emit('hidden')
    },
    focus() {
      this.$emit('query', this.query, true)
    },
    setQuery(query) {
      this.query = query
    },
    search(e) {
      this.$emit('search', e, this.query)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
.search
  line-height 40px
  height 35px
  width 100%
  background rgba(0, 0, 0, .1)
  display flex
  align-items center
  border-radius 20px
  .icon-search
    padding-left 10px
    padding-right 10px
    color $color-text-d
  input
    flex 1
    outline none
    background-color:transparent
    line-height 40px
    font-size $font-size-small-x
</style>

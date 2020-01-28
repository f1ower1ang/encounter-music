<template>
  <div class="category">
    <div style="padding: 0 20px">
      <p class="title">
        {{ name }}
      </p>
      <pagination
        ref="content"
        :flag="flag"
        :total="sum"
        :page="page"
        :size="60"
        :list="list"
        style="height: calc(100% - 60px)"
        @current-change="handleCurrentChange"
        @prev-click="changePage(page - 1)"
        @next-click="changePage(page + 1)"
      >
        <disc-list v-show="discs.length > 0" slot="content" :discs="discs" @select="selectDisc" />
        <div v-show="discs.length === 0" slot="loading" class="loading">
          <loading />
        </div>
      </pagination>
    </div>
  </div>
</template>

<script>
import DiscList from '../components/DiscList/DiscList'
import Loading from '../components/Loading/Loading'
import pagination from '../components/pagination/pagination'
import { getDicList } from '../api/index/recommend'

export default {
  name: 'Discat',
  components: { DiscList, Loading, pagination },
  data() {
    return {
      page: 0,
      name: '',
      discs: [],
      sum: 0,
      flag: false,
      history: '',
      list: false
    }
  },
  watch: {
    $route(n, o) {
      this.history = o.path
    }
  },
  activated() {
    if (this.history.match('/discSong')) {
      return
    }
    this.flag = false
    this.name = this.$route.query.name
    this.getDiscList(1)
  },
  methods: {
    handlePlayList(playList) {
      this.list = playList.length > 0
    },
    selectDisc(item) {
      this.$router.push(`/discSong?id=${item.discId}&type=qq`)
    },
    handleCurrentChange(val) {
      this.getDiscList(val)
    },
    async getDiscList(page) {
      this.discs = []
      const { discList } = await getDicList(this.$route.query.id, 60, page - 1)
      this.discs = discList.lists
      this.sum = discList.sum
      this.page = page
      this.flag = true
    },
    changePage(page) {
      this.page = page
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/stylus/variable.styl"
  .category
    height 100%
    overflow auto
    background linear-gradient($color-background-l, $color-background-d)
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar
      display: none; /* Chrome Safari */
    .title
      padding-top 40px
      font-weight bold
      font-size $font-size-large
  .loading
    width 100%
    flex 1
</style>

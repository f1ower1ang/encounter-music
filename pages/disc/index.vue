<template>
  <m-content>
    <m-block>
      <div class="hot-cat">
        <p class="title">
          热门分类
        </p>
        <el-row class="cat" :gutter="5">
          <el-col
            v-for="(item, index) in hotCats"
            :key="index"
            :xs="12"
            :sm="6"
            :lg="3"
            class="item grid-content"
            @click.native="selectDisCat(item.id, item.name)"
          >
            <p>
              {{ item.name }}
            </p>
          </el-col>
          <el-col
            tag="li"
            :xs="12"
            :sm="6"
            :lg="3"
            class="item"
            @click.native="selectDisCat(0)"
          >
            <p>
              全部
            </p>
          </el-col>
        </el-row>
      </div>
      <div ref="content" class="disc-content">
        <p class="title">
          精选歌单
        </p>
        <disc-list v-show="discs.length > 0" :discs="discs" />
        <div v-show="discs.length === 0" ref="loading" class="loading">
          <loading />
        </div>
        <el-pagination
          v-show="discs.length > 0 || flag"
          class="page"
          layout="prev, pager, next, jumper"
          :pager-count="7"
          :current-page="page"
          :total="sum"
          :page-size="60"
          @current-change="handleCurrentChange"
          @prev-click="changePage(page - 1)"
          @next-click="changePage(page + 1)"
        />
      </div>
    </m-block>
  </m-content>
</template>

<script>
import MContent from '../../components/Content/Content'
import MBlock from '../../components/Block/Block'
import DiscList from '../../components/DiscList/DiscList'
import Loading from '../../components/Loading/Loading'
import { getHotCat, getDicList } from '../../api/index/recommend'
import { playListMixin } from '../../assets/js/mixin'

export default {
  components: { MContent, MBlock, DiscList, Loading },
  transition: 'slide',
  mixins: [playListMixin],
  data() {
    return {
      hotCats: [],
      discs: [],
      sum: 0,
      page: 0,
      list: false,
      flag: false
    }
  },
  async asyncData() {
    const { hotCat } = await getHotCat()
    return {
      hotCats: hotCat
    }
  },
  async created() {
    const { discList } = await getDicList(10000000, 60, this.page)
    this.sum = discList.sum
    this.discs = discList.lists
    this.page++
    this.flag = true
  },
  mounted() {
    this.$refs.loading.style.height = `${window.innerHeight - 276}px`
    window.onresize = () => {
      this.$refs.loading.style.height = `${window.innerHeight - 276}px`
    }
  },
  methods: {
    handlePlayList(playList) {
      this.list = playList.length > 0
    },
    selectDisCat(id, name) {
      if (id !== 0) {
        this.$router.push(`/discat?id=${id}&name=${name}`)
      } else {
        this.$router.push('/allcat')
      }
    },
    handleCurrentChange(val) {
      this.getDiscList(val)
    },
    async getDiscList(page) {
      this.discs = []
      this.$refs.loading.style.height = this.list ? `${window.innerHeight - 386}px` : `${window.innerHeight - 326}px`
      const { discList } = await getDicList(10000000, 60, page - 1)
      this.discs = discList.lists
      this.page = page
    },
    changePage(page) {
      this.page = page
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .title
    font-size $font-size-medium-x
    letter-spacing 6px
    padding-top 30px
  .hot-cat
    width 100%
    overflow hidden
    .cat
      height 60px
      margin-top 20px
      .item
        text-align center
        font-size $font-size-small
        margin-bottom 5px
        p
          width 100%
          height 100%
          line-height 30px
          background $color-background-l
          transition all .2s
        &:hover
          p
            background $color-border
  .loading
    width 100%
  .pagination-wrapper
    width 100%
  .page
    padding-bottom 20px
    text-align: center
</style>

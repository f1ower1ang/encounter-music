<template>
  <m-content ref="parent">
    <div class="singer">
      <div class="category">
        <el-row v-for="(li, index) in category" :key="index" ref="cat" class="list">
          <li v-for="(item, idx) in li.list" :key="idx" class="item" @click="selectCat($event, item, li)">
            {{ item.name }}
          </li>
        </el-row>
      </div>
      <pagination
        :page="page"
        :total="total"
        :size="80"
        :flag="flag"
        :error="error"
        @current-change="handleCurrentChange"
        @prev-click="changePage(page-1)"
        @next-click="changePage(page+1)"
      >
        <div v-if="singers.length > 0" slot="content">
          <el-row class="singer-list" :gutter="15">
            <el-col
              v-for="(singer, idx) in singers"
              :key="idx"
              class="item"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
            >
              <div class="singer-wrapper">
                <img :key="singer.imgUrl" v-lazy="imgObj(singer)" alt="" @click="selectSinger(singer)">
                <p @click="selectSinger(singer)">
                  {{ singer.singer }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-show="singers.length === 0 && !error" ref="loading" slot="loading" class="loading">
          <loading />
        </div>
      </pagination>
      <div v-show="error" class="error">
        <no-result msg="该分类下暂无歌手" />
      </div>
    </div>
  </m-content>
</template>

<script>
import MContent from '../../components/Content/Content'
import NoResult from '../../components/noResult/noResult'
import pagination from '../../components/pagination/pagination'
import Loading from '../../components/Loading/Loading'
import { singerCat, singerList } from '../../api/index/singer'
import { playListMixin } from '../../assets/js/mixin'

export default {
  components: { MContent, Loading, NoResult, pagination },
  transition: 'slide',
  mixins: [playListMixin],
  data() {
    return {
      category: [],
      query: {
        area: -100,
        sex: -100,
        genre: -100,
        index: -100
      },
      page: 0,
      total: 0,
      singers: [],
      flag: false,
      error: false,
      list: false
    }
  },
  async asyncData() {
    const res = await singerCat()
    return {
      category: res
    }
  },
  created() {
    this.getSingerList(1)
    this.flag = true
    this.hidden = true
    this.page++
  },
  mounted() {
    this.$refs.loading.style.height = this.list ? `${window.innerHeight - 360}px` : `${window.innerHeight - 300}px`
    window.onresize = () => {
      this.$refs.loading.style.height = this.list ? `${window.innerHeight - 360}px` : `${window.innerHeight - 300}px`
    }
    this.$refs.cat.forEach((el) => {
      el.$el.children[0].className = 'item active'
    })
  },
  methods: {
    imgObj(singer) {
      return {
        src: singer.imgUrl,
        error: 'http://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000',
        loading: 'http://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000'
      }
    },
    handlePlayList(playList) {
      this.list = playList.length > 0
    },
    handleCurrentChange(val) {
      this.$refs.loading.style.height = this.list ? `${window.innerHeight - 425}px` : `${window.innerHeight - 365}px`
      this.getSingerList(val)
    },
    selectSinger(singer) {
      this.$router.push(`/singer/detail?id=${singer.id}&type=qq`)
    },
    selectCat(e, item, list) {
      this.flag = false
      this.$refs.loading.style.height = this.list ? `${window.innerHeight - 360}px` : `${window.innerHeight - 300}px`
      this.page = 1
      e.target.offsetParent.childNodes.forEach((el) => {
        el.className = 'item'
      })
      e.target.className = 'item active'
      this.query[list.title] = item.id
      this.getSingerList(this.page)
    },
    async getSingerList(page) {
      this.singers = []
      const res = await singerList(this.query, page - 1)
      this.flag = true
      this.total = res.total
      this.singers = res.singerlist
      this.error = this.total === 0
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
  @import "../../assets/stylus/mixin.styl"
  .singer
    width 100%
    padding 20px
    box-sizing border-box
    background $color-background-l

    .category
      width 90%

      .list
        font-size $font-size-medium

        .item
          float left
          line-height 40px
          margin-right 20px

          &:first-child
            width 70px
            margin-right 0

          &:hover
            color $color-theme
            cursor pointer

          &.active
            color $color-theme

        &:nth-child(3)
          .item
            margin-right 34px

            &:first-child
              margin-right 0

    .singer-list
      width 100%
      margin-top 20px

      .item
        text-align center
        margin-bottom 20px

        .singer-wrapper
          background $color-background
          width 100%

          img
            width 50%
            border-radius 50%
            margin-top 5%

            &:hover
              cursor pointer

          p
            margin-top 5%
            width 80%
            padding-bottom 15px
            margin-left 10%
            font-size $font-size-medium
            no-wrap()
            transition all .2s

            &:hover
              cursor pointer
              color $color-theme

    .loading
      width 100%

    .error
      padding 10% 0

    .page
      margin-top 20px
      text-align center
</style>

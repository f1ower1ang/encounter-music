<template>
  <m-content>
    <MBlock class="slider">
      <el-carousel
        :interval="4000"
        type="card"
        trigger="click"
        arrow="hover"
        height="230px"
      >
        <el-carousel-item v-for="(item, index) in sliders" :key="index" @click.native="selectSlider(item)">
          <img :src="item.imgUrl" height="240px" alt="">
        </el-carousel-item>
      </el-carousel>
    </MBlock>
    <MBlock class="disc-content">
      <el-row style="line-height: 40px">
        <el-col :span="12" style="font-size: 18px; letter-spacing: 4px">
          <p>为你推荐的歌单</p>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <nuxt-link to="/disc">
            更多
          </nuxt-link>
        </el-col>
      </el-row>
      <div class="catgory">
        <nuxt-link v-for="(item, index) in dicCats" :key="index" :to="'/discat?id=' + item.id + '&name=' + item.name" tag="p">
          {{ item.name }}
        </nuxt-link>
        <nuxt-link to="/allcat" tag="p">
          全部分类
        </nuxt-link>
      </div>
      <disc-list
        :discs="discList"
      />
    </MBlock>
    <MBlock class="album-content">
      <el-row style="line-height: 40px">
        <el-col style="font-size: 18px; letter-spacing: 4px">
          <p>最新专辑</p>
        </el-col>
      </el-row>
      <disc-list
        type="album"
        :discs="albumList"
      />
    </MBlock>
    <div class="mv-content">
      <el-row class="row">
        <el-col style="font-size: 18px; letter-spacing: 4px">
          <p>为你推荐的MV</p>
        </el-col>
      </el-row>
      <mv-list
        :mvs="mvList"
      />
    </div>
  </m-content>
</template>

<script>
import { mapActions } from 'vuex'
import MContent from '../components/Content/Content'
import MBlock from '../components/Block/Block'
import DiscList from '../components/DiscList/DiscList'
import MvList from '../components/MvList/MvList'
import { getSlider, getDicCat, getRecDisc, getRecAlbum, getRecMV } from '../api/index/recommend'
import { songDetail } from '../api/index/song'
import { createSong } from '../assets/js/song'

export default {
  components: { MContent, MBlock, DiscList, MvList },
  transition: 'slide',
  data() {
    return {
      sliders: [],
      dicCats: [],
      discList: [],
      albumList: [],
      mvList: []
    }
  },
  async asyncData() {
    const { dicCat, code: code2 } = await getDicCat()
    let cat = []
    if (code2 === 0) {
      dicCat.forEach((c) => {
        cat = cat.concat(c.items.slice(0, 2))
      })
      cat.splice(9, 1)
    } else {
      cat = []
    }
    return {
      dicCats: cat,
      albumList: await getRecAlbum(),
      discList: await getRecDisc(),
      mvList: await getRecMV()
    }
  },
  async created() {
    const { sliders, code } = await getSlider()
    this.sliders = code === 200 ? sliders : []
  },
  methods: {
    selectSlider(slider) {
      let route = ''
      switch (slider.targetType) {
        case 1004:
          route = `/mv`
          break
        case 100:
          route = `/singer/detail`
          break
        case 1000:
          route = `/discSong`
          break
        case 10:
          route = `/album`
          break
        case 1:
          songDetail(slider.id).then((res) => {
            this.insertSong(createSong(res))
          })
      }
      if (route.length > 0) {
        route += `?id=${slider.id}&type=nt`
        this.$router.push(route)
      }
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>
<style lang="stylus">
  @import "../assets/stylus/variable.styl"
    .slider
      padding-top 10px
      .el-carousel
        overflow hidden
        z-index 0
        .el-carousel__indicators
          position absolute
          bottom 0
          left 50%
          transform translateX(-50%)
    .disc-content
      padding-top 20px
      .catgory
        display flex
        width 100%
        p
          flex 1
          line-height 30px
          background $color-background-l
          text-align center
          margin-right 6px
          font-size $font-size-medium
          transition all .2s
          &:hover
            background $color-border
            cursor pointer
          &:last-child
            margin-right 0
    .disc-content
      padding 0 20px
    .mv-content
      linear-gradient($color-background-l, $color-background-d)
      padding-top 10px
      .row
        padding 0 20px
  .el-pagination .btn-next, .el-pagination .btn-prev, .el-pagination button:disabled
    background transparent
  .el-dialog, .el-pager li
    background transparent
  .el-pagination
    color $color-text-l
  .el-pager li.active
    color $color-theme
</style>

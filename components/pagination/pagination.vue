<template>
  <div style="height: 100%">
    <div style="display: flex; flex-direction: column; height: 100%;">
      <slot name="content" />
      <slot name="loading" />
      <el-pagination
          v-show="flag && !error"
          class="page"
          layout="prev, pager, next, jumper"
          :pager-count="7"
          :current-page="page"
          :total="total"
          :page-size="size"
          :hide-on-single-page="hidden"
          @current-change="handleCurrentChange"
          @prev-click="prev"
          @next-click="next"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongPage',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 30
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hidden: true
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    prev() {
      this.$emit('prev-click')
    },
    next() {
      this.$emit('next-click')
    }
  }
}
</script>

<style scoped lang="stylus">
  .page
    padding-bottom 20px
    padding-top 20px
    box-sizing border-box
    text-align: center
</style>

<template>
  <div class="process-bar" @click="progressClick">
    <div ref="parent" class="inner-bar">
      <div ref="process" class="current" />
      <div
        ref="btn"
        class="btn-wrapper"
        @mousedown.prevent.stop="progressTouchStart"
      >
        <i class="btn" :class="show" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProcessBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      initial: false
    }
  },
  computed: {
    show() {
      return this.initial ? 'show' : ''
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initial) {
        const width = newPercent * this.$refs.parent.clientWidth
        this._offset(width)
      }
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    window.addEventListener('mousemove', this.progressTouchMove)
    window.addEventListener('mouseup', this.progressTouchEnd)
  },
  methods: {
    _offset(offsetWidth) {
      this.$refs.process.style.width = `${offsetWidth}px`
      this.$refs.btn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    },
    _trigger() {
      this.$emit('progressChange', this.$refs.process.clientWidth / this.$refs.parent.clientWidth)
    },
    progressClick(e) { // 记录手指点击的x偏移量
      const offsetWidth = e.clientX - this.$refs.parent.getBoundingClientRect().left
      this._offset(offsetWidth)
      this._trigger()
    },
    progressTouchStart(e) { // 记录一开始手指触摸的位置
      this.touch.initial = true
      this.initial = true
      this.touch.left = this.$refs.process.clientWidth
      this.touch.offsetX = e.clientX
    },
    progressTouchMove(e) { // 实时监听手指滑动的距离，并计算当前进度
      if (!this.touch.initial) {
        return false
      }
      const delta = e.clientX - this.touch.offsetX
      const offsetWidth = Math.min(this.$refs.parent.clientWidth, Math.max(0, this.touch.left + delta))
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) { // 滑动结束，向父组件派发进度修改事件，并将当前进度传递给父组件
      if (this.touch.initial) {
        this._trigger()
        this.touch.initial = false
        this.initial = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
.process-bar
  position absolute
  top -5px
  height 10px
  width 100%
  .inner-bar
    top 50%
    transform translateY(-50%)
    position relative
    width 100%
    height 2px
    background rgba(213,213,213,.35)
    .current
      width 0
      position absolute
      background $color-theme
      height 100%
    .btn-wrapper
      position absolute
      top -10px
      left -10px
      width 20px
      height 20px
      text-align center
      .btn
        margin 0 auto
        margin-top 5px
        width 10px
        opacity 0
        height 10px
        display block
        transition all .2s
        background $color-theme
        border-radius 50%
      .show
        opacity 1
  &:hover
    .btn-wrapper
      .btn
        opacity 1
</style>

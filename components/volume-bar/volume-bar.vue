<template>
  <div ref="volume" class="volume-bar" @click="progressClick">
    <div ref="current" class="current" />
    <div ref="btn" class="btn" @mousedown.stop="touchStart" />
  </div>
</template>

<script>
export default {
  name: 'VolumeBar',
  props: {
    percent: {
      type: Number,
      default: 1
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent > 0 && !this.touch.initial) {
        const height = this.$refs.volume.clientHeight * newPercent
        this._offset(height)
      }
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.touchMove)
    window.addEventListener('mouseup', this.touchEnd)
  },
  activated() {
    this._offset(94)
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      const delta = this.$refs.volume.clientHeight - (e.clientY - this.$refs.volume.getBoundingClientRect().top)
      this._offset(delta)
      this._trigger()
    },
    touchStart(e) {
      this.touch.initial = true
      this.touch.bottom = this.$refs.current.clientHeight
      this.touch.offsetY = e.clientY
    },
    touchMove(e) {
      if (this.touch.initial) {
        const delta = -(e.clientY - this.touch.offsetY)
        const clientHeight = Math.min(this.$refs.volume.clientHeight, Math.max(0, delta + this.touch.bottom))
        this._offset(clientHeight)
      }
    },
    touchEnd() {
      if (this.touch.initial) {
        this.touch.initial = false
        this._trigger()
      }
    },
    _offset(clientHeight) {
      this.$refs.current.style.height = `${clientHeight}px`
      this.$refs.btn.style.transform = `translate3d(0, -${clientHeight}px, 0)`
    },
    _trigger() {
      this.$emit('progressChange', this.$refs.current.clientHeight / this.$refs.volume.clientHeight)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .volume-bar
    position absolute
    left 50%
    transform translateX(-50%)
    width 3px
    background #47494e
    top 12px
    bottom 11px
    cursor pointer
    .current
      position absolute
      bottom 0
      width 100%
      height 100%
      background $color-theme
    .btn
      position absolute
      bottom -3px
      left -3px
      width 9px
      height 9px
      background #fff
      border-radius 50%

</style>

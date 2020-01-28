<template>
  <transition name="fade">
    <div v-show="showMsg" class="message">
      {{ message }}
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Message',
  computed: {
    ...mapGetters([
      'message',
      'showMsg'
    ])
  },
  watch: {
    showMsg(newFlag) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (newFlag) {
          this.setShowMsg(false)
        }
      }, 2000)
    }
  },
  methods: {
    ...mapMutations({
      setShowMsg: 'SET_SHOW_MSG'
    })
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  @import "../../assets/stylus/mixin.styl"
  .message
    width 350px
    text-align left
    box-sizing border-box
    padding-left 10px
    font-size $font-size-medium-x
    position fixed
    top 10px
    height 40px
    line-height 40px
    left 50%
    transform translateX(-50%)
    z-index 111
    background #edf2fc
    color #909399
    border-radius 4px
    no-wrap()
    &.fade-enter-active, &.fade-leave-active
      transition all .4s
    &.fade-enter, &.fade-leave-to
      opacity 0
      transform translateY(-50px)
</style>

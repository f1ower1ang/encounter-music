<template>
  <div class="no-result">
    <img src="../../assets/image/default.png" alt="">
    <p>
      {{ msg }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    msg: {
      type: String,
      default: '暂无结果'
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .no-result
    width 100%
    height 100%
    text-align center
    p
      font-size $font-size-medium-x
      margin-top 10px
</style>

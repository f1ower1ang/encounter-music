<template>
  <div class="container-fluid">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Block'
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .container-fluid
    padding 0 20px
    background linear-gradient($color-background-l, $color-background-d)
</style>

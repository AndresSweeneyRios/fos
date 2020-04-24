<template lang="pug">
  section.navigation
    .bar
      button( aria-label="Channels menu" )
        Icon list

      button( aria-label="Users menu" )
        Icon user

      button.settings( aria-label="Settings menu" )
        Icon settings

    .panel
</template>

<script>
  import Icon from './Icon'

  export default {
    components: {
      Icon,
    },
  }
</script>

<style lang="sass" scoped>
  .bar
    width: 45px
    height: 100vh
    background-color: var(--navigation-bar)
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: stretch

    button
      width: 45px
      height: 45px

    button.settings
      margin-top: auto
</style>

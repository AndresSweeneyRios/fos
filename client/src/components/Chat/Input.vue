<template lang="pug">
  section.input
    button.attach( aria-label="Add attachment" )
      Icon paperclip
    label( for="message-input" ) Enter message
    textarea( placeholder="Enter message.." id="message-input" )
</template>

<script>
  import Icon from '../Icon'

  export default {
    components: {
      Icon,
    },
  }
</script>

<style lang="sass" scoped>
  section.input
    display: flex
    width: 100%
    min-height: 45px
    background-color: var(--input-background)

    button.attach
      height: 45px
      width: 45px

    label
      opacity: 0
      pointer-events: none
      position: absolute

    textarea
      height: 45px
      flex-grow: 1
      line-height: 45px
      padding-left: 5px
      resize: none
</style>

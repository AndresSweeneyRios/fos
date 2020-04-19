<template lang="pug">
  section.input
    button.attach A
    textarea( placeholder="Enter message.." )
</template>

<style lang="sass" scoped>
  section.input
    display: flex
    width: 100%
    min-height: 45px
    background-color: var(--input-background)

    button.attach
      height: 45px
      width: 45px

    textarea
      height: 45px
      flex-grow: 1
      line-height: 45px
      padding-left: 5px
      resize: none
</style>
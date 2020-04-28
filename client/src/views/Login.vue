<template lang="pug">
  form.login
    h1 Log in

    .social
      button.fill
        Icon google

      button.fill
        Icon github

      button.fill
        Icon twitter

      button.fill
        Icon discord

    .divider OR

    input( placeholder="Username.." )
    input( placeholder="Password.." type="password" )

    button.fill 
      span Submit

    p 
      span Don't have an account? 
      a( href="/signup" ) Sign up
</template>

<script>
  import Icon from '@/components/Icon'

  export default {
    components: {
      Icon,
    },
  }
</script>

<style lang="sass" scoped>
  form.login
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    max-width: 272px
    height: 100%
    flex-direction: column
    text-align: center
    margin: auto

    h1
      font-weight: 200
      margin-bottom: 20px

    .social
      display: flex
      justify-content: space-between
      width: 100%
      padding: 0

      button
        width: 62px
        height: 62px

        svg
          width: 40px
          height: 40px
          fill: var(--white)

    .divider
      display: flex
      align-items: center
      justify-content: center
      opacity: 0.7
      font-size: 10px
      margin: 20px 0

      &::before, &::after
        content: ''
        height: 1px
        width: 53px
        margin: 5px
        background-color: var(--white)
        opacity: 0.7

    > *
      width: 100%

    input
      padding-left: 14px

    input:first-of-type
      margin-bottom: 8px

    input, > button, p
      font-size: 14px
      letter-spacing: 0.25px

    input, > button
      min-height: 43px

    > button
      font-weight: 600
      margin-top: 20px

    p
      margin-top: 14px
      font-size: 12px
      
      span
        opacity: 0.7
</style>

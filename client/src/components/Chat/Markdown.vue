<template lang="pug">
  .markdown( v-html="md($slots.default[0].text)" )
</template>

<script>
  import MarkdownIt from 'markdown-it'
  import Prism from 'prismjs'

  const markdown = MarkdownIt({
    linkify: true,
    highlight (string, language) {
      return language && Prism.languages[language]  
        ? Prism.highlight(string, Prism.languages[language])
        : string
    },
  })

  export default {
    methods: {
      md: string => markdown.render(string),
    },
  }
</script>

<style lang="sass" scoped>
  @import '~css/prism.css'
</style>

<style lang="sass">
  .markdown
    width: 100%

  .markdown pre
    background-color: var(--input-background)
    
    *
      font-family: 'Fira Code'
</style>

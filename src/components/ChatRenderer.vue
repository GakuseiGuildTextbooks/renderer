<template>
  <span v-for="part in chat.parts">
      <span v-if="part.type == 'markdown'" v-html="compile(part.data)"></span>
      <div v-else-if="part.type == 'img'" style="text-align: center">
        <img :src="assets[part.path].url" v-if="part.width && part.height" :width="part.width" :height="part.height" class="image">
        <img :src="assets[part.path].url" v-else-if="part.width" :width="part.width" class="image">
        <img :src="assets[part.path].url" v-else-if="part.height" :height="part.height" class="image">
        <img :src="assets[part.path].url" v-else class="image">
      </div>
  </span>
</template>
<script>
import marked from 'marked'
import hljs from 'highlight.js'
export default {
  props: {
    chat: Object,
    assets: Object,
  },
  data () {
    return {
      renderer: null
    }
  },
  created () {
    const renderer = new marked.Renderer()
    renderer.table = (header, body) => {
      if (body) body = '<tbody>' + body + '</tbody>'
      return '<table border>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n'
    }
    this.renderer = renderer
  },
  methods: {
    compile: function(data) {
      marked.setOptions({
        renderer: this.renderer,
        breaks: true,
        langPrefix: '',
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value
        }
      })
      const compileHTML = marked(data)
      return compileHTML
    }
  }
}
</script>
<style src='highlight.js/styles/github-gist.css'></style>
<style lang="scss">
  .image {
    max-width: 100%;
    max-height: 500px;
  }
</style>

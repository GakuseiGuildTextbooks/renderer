<template>
  <div class="lesson">
    <DhonRenderer :src="dhonfile" :assetLoad="assetLoad" v-if="dhonfile"/>
  </div>
</template>
<script>
  import axios from 'axios'
  import DhonRenderer from '../components/DhonRenderer.vue'
  export default {
    components: {
      DhonRenderer
    },
    data () {
      return {
        dhonfile: null,
        lessonId: this.$route.params.id,
      }
    },
    created() {
      axios.get('/course/'+this.lessonId+'/Dhonfile.dhon').then(res => {
        console.log(res.data)
        this.dhonfile = res.data
      })
    },
    methods: {
      assetLoad: function (path) {
        return new Promise((resolve, reject) => {
          axios.get('/course/'+this.lessonId+'/images/'+path, {responseType: "blob"}).then((res) => {
            // console.log(res)
            const url = window.URL.createObjectURL(res.data)
            const image = new Image()
            image.src = url
            image.onload = () => {
              resolve({
                path: path,
                url: url,
                width: image.naturalWidth,
                height: image.naturalHeight
              })
            }
          }).catch(() => {
            axios.get('/course/images/'+path, {responseType: "blob"}).then((res) => {
              // console.log(res)
              const url = window.URL.createObjectURL(res.data)
              const image = new Image()
              image.src = url
              image.onload = () => {
                resolve({
                  path: path,
                  url: url,
                  width: image.naturalWidth,
                  height: image.naturalHeight
                })
              }
            }).catch(() => {
              reject()
            })
          })
        })
      }
    }
  }
</script>
<template>
  <div class="container">
    <h1 class="title">{{ parsedSrc.env.title }}</h1>
    <p class="author">{{ parsedSrc.env.author }}</p>
    <div v-for="doc in parsedSrc.docs" :key="doc.title">
      <h2>{{ doc.title }}</h2>
      <div v-for="chat in doc.chats">
        <div v-if="chat.speaker[0] == '*'" class="system">
          <div class="system-text">
            <div class="system-text-inner">
              <ChatRenderer :chat="chat" :assets="illustrationAssets"/>
            </div>
          </div>
        </div>
        <div v-else-if="charas[chat.speaker[0]].position == '左'" class="chat">
          <div class="chat-box chat-box-left">
            <div class="chat-box-image chat-box-image-left">
              <img src="@/assets/clear.png"
                style="width: 100px;height: 100%;background-size: cover;"
                :style="{backgroundImage: 'url('+characterAssets[chat.speaker[0]].url+')', maxHeight: (characterAssets[chat.speaker[0]].height / characterAssets[chat.speaker[0]].width * 100) + 'px'}">
            </div>
            <div class="chat-box-inner">
              <ChatRenderer :chat="chat" :assets="illustrationAssets"/>
            </div>
          </div>
          <div class="chat-padding"/>
        </div>
        <div v-else-if="charas[chat.speaker[0]].position == '右'" class="chat">
          <div class="chat-padding"/>
          <div class="chat-box chat-box-right">
            <div class="chat-box-inner">
              <ChatRenderer :chat="chat" :assets="illustrationAssets"/>
            </div>
            <div class="chat-box-image chat-box-image-right">
              <img src="@/assets/clear.png"
                style="width: 100px;height: 100%;background-size: cover;"
                :style="{backgroundImage: 'url('+characterAssets[chat.speaker[0]].url+')', maxHeight: (characterAssets[chat.speaker[0]].height / characterAssets[chat.speaker[0]].width * 100) + 'px'}">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DhonLoader from '../utils/dhon_loader'
import ChatRenderer from'./ChatRenderer'
export default {
  name: 'DhonRenderer',
  props: {
    src: String,
    assetLoad: Function
  },
  components: {
    ChatRenderer
  },
  data () {
    return {
      parsedSrc: null,
      charas: {},
      characterAssets: {},
      illustrationAssets: {}
    }
  },
  created () {
    this.loadAssets()
  },
  methods: {
    loadAssets: function () {
      this.parsedSrc = DhonLoader(this.src)
      // キャラクターを定義する
      for (let chara of this.parsedSrc.charas) {
        this.charas[chara[0]] = {
          position: chara[1]
        }
        let key = chara[0]
        this.characterAssets[key] = {
          path: chara[2],
          url: "",
          width: 100,
          height: 100
        }
      }
      // 挿絵アセットを定義する
      for (let doc of this.parsedSrc.docs) {
        for (let chat of doc.chats) {
          for (let part of chat.parts) {
            if (part.type == 'img')
              this.illustrationAssets[part.path] = {
                path: part.path,
                url: "",
                width: 100,
                height: 100
              }
          }
        }
      }
      
      // キャラクターアセットのロード
      for (let key in this.characterAssets) {
        this.assetLoad(this.characterAssets[key].path).then((asset) => {
          this.characterAssets[key] = asset
        }).catch(() => {})
      }
      // 挿絵アセットのロード
      for (let key in this.illustrationAssets) {
        this.assetLoad(this.illustrationAssets[key].path).then((asset) => {
          this.illustrationAssets[key] = asset
        }).catch(() => {})
      }
    },
  }
}
</script>
<style lang="scss">
  * {
    box-sizing: border-box;
  }
  .container {
    width: 700px;
    max-width: 95%;
    margin-right: auto;
    margin-left : auto;
    padding: 0 16px;
  }
  .title {
    width: 100%;
    padding: 0;
    text-align: center;
  }
  .author {
    text-align: right;
  }
  .chat {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 16px;
    &-box {
      position: relative;
      display: flex;
      flex-grow: 1;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0,0,128,.15);
      &-image {
        flex-grow: 0;
        flex-shrink: 0;
        width: 100px;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      &-image-left {
        border-radius: 50px 0px 0px 50px;
      }
      &-image-right {
        border-radius: 0px 50px 50px 0px;
      }
      &-inner {
        flex-grow: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      &-left {
        border-radius: 50px 8px 8px 50px;
      }
      &-right {
        border-radius: 8px 50px 50px 8px;
      }
    }
    &-padding {
      flex-direction: column;
      width: 100px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
  .system {
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    &-text {
      flex-grow: 1;
      padding: 16px 0;
      &-inner {
        border: solid 1px #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0,0,128,.1);
        padding: 16px;
      }
    }
    &-padding {
      flex-direction: column;
      width: 100px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
</style>
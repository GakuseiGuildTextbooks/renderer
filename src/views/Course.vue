<template>
  <div v-if="courseConfig">
    <h1>{{ courseConfig.course_title }}</h1>
    <div>バージョン: {{ courseConfig.version }}</div>
    <div>Id: {{ courseConfig.course_id }}</div>
    <div>対象年齢: {{ courseConfig.target }}</div>
    <table border>
      <tr>
        <th>ターゲット</th>
        <th>年齢</th>
        <th>それぞれのイメージ</th>
      </tr>
      <tr>
        <td>A</td>
        <td>小学生以上向け</td>
        <td>四則演算ができる．条件分岐やループはわかるかも．変数を習ってない．</td>
      </tr>
      <tr>
        <td>B</td>
        <td>中学生以上向け</td>
        <td>変数を知っている．プログラミング言語の基礎文法ならいけると思う．</td>
      </tr>
      <tr>
        <td>C</td>
        <td>高校生以上向け</td>
        <td>
          ある程度の数学レベル（変数，関数，三角関数，対数関数）で，アルゴリズムもある程度理解できる気がする．<br/>
          正直このレベルの数学ができない人でもプログラミングは充分かけるので問題なさそう．
        </td>
      </tr>
      <tr>
        <td>D</td>
        <td>大学生・専門学校以上向け</td>
        <td>
          専門分野に特化したプログラミング技術が需要があるのではないか．<br/>
        </td>
      </tr>
      <tr>
        <td>E</td>
        <td>大学院生以上向け</td>
        <td>
          多分なんでもいけるよ．多分．
        </td>
      </tr>
    </table>
    <ul>
    <li v-for="lessonId in lessons" :key="lessonId">
      <router-link :to="'/lessons/'+lessonId">第{{ lessonId }}講</router-link>
    </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
  export default {
    data () {
      return {
        courseConfig: null,
        lessons: []
      }
    },
    created () {
      axios.get("/course/config.json").then((res) => {
        this.courseConfig = res.data
      })
      axios.get("/course").then((res) => {
        let lessons = res.data.filter((item) => {
          return 	/^\d*$/.test(item)
        })
        lessons = lessons.map((item) => Number(item)).sort((a, b) => a - b)
        this.lessons = lessons
      })
    }
  }
</script>
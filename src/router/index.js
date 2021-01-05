import { createRouter, createWebHistory } from 'vue-router'
import Course from '../views/Course.vue'
import Lesson from '../views/Lesson.vue'

const routes = [
  {
    path: '/',
    name: 'Course',
    component: Course
  },
  {
    path: '/lessons/:id',
    name: 'Lesson',
    component: Lesson
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/view/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import('@/view/home/index.vue')
      },
      {
        name: 'detail',
        path: '/app/detail',
        component: () => import('@/view/app-detail/index.vue')
      },
      {
        name: 'video',
        path: '/video',
        component: () => import('@/view/video/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

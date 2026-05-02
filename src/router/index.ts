// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import('@/view/home/index.vue'),
      },
      {
        name: 'detail',
        path: '/app/detail',
        component: () => import('@/view/app-detail/index.vue'),
      },
      {
        name: 'video',
        path: '/video/:id',
        component: () => import('@/view/video/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

export default router;

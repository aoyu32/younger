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
        meta: {
          title: '首页',
        },
      },
      {
        name: 'detail',
        path: '/app/detail/:id',
        component: () => import('@/view/app-detail/index.vue'),
        meta: {
          title: '应用详情',
        },
      },
      {
        name: 'video',
        path: '/video/:id',
        component: () => import('@/view/video/index.vue'),
        meta: {
          title: '视频详情',
        },
      },
      {
        name: 'news',
        path: '/news/:id',
        component: () => import('@/view/news/index.vue'),
        meta: {
          title: '新闻详情',
        },
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/view/auth/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/view/auth/register/index.vue'),
    meta: {
      title: '注册',
    },
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

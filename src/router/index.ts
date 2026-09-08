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
        name: 'YOUNGER',
        path: '/home',
        component: () => import('@/view/home/index.vue'),
        meta: {
          title: '洋果教育',
          menu: false,
        },
      },
      {
        name: 'video',
        path: '/video',
        component: () => import('@/view/video/index.vue'),
        meta: {
          title: '教程中心',
          menu: true,
        },
      },
      {
        name: 'application',
        path: '/app',
        component: () => import('@/view/app/index.vue'),
        meta: {
          title: '应用中心',
          menu: true,
        },
      },

      {
        name: 'website',
        path: '/website',
        component: () => import('@/view/website/index.vue'),
        meta: {
          title: '网站导航',
          menu: true,
        },
      },
      {
        name: 'news',
        path: '/news',
        component: () => import('@/view/app/index.vue'),
        meta: {
          title: 'AI资讯',
          menu: true,
        },
      },
      {
        name: 'app-detail',
        path: '/app/:id',
        component: () => import('@/view/app-detail/index.vue'),
        meta: {
          title: '应用详情',
          menu: false,
        },
      },
      {
        name: 'video-detail',
        path: '/video/:id',
        component: () => import('@/view/video-detail/index.vue'),
        meta: {
          title: '视频详情',
          menu: false,
        },
      },
      {
        name: 'news-detail',
        path: '/news/:id',
        component: () => import('@/view/news/index.vue'),
        meta: {
          title: '新闻详情',
          menu: false,
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
      menu: false,
    },
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/view/auth/register/index.vue'),
    meta: {
      title: '注册',
      menu: false,
    },
  },
  {
    name: 'reset',
    path: '/reset',
    component: () => import('@/view/auth/reset/index.vue'),
    meta: {
      title: '重置密码',
      menu: false,
    },
  },
  {
    name: 'vip',
    path: '/vip',
    component: () => import('@/view/vip/index.vue'),
    meta: {
      title: '开通会员',
      menu: false,
    },
  },
  {
    name: 'pay',
    path: '/pay',
    component: () => import('@/view/pay/index.vue'),
    meta: {
      title: '支付',
      menu: false,
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

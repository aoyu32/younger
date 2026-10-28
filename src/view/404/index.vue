<template>
  <div class="error-page">
    <span class="error-page__grid" aria-hidden="true" />

    <div class="error-page__content">
      <div class="error-page__icon">
        <img :src="iconLose" alt="页面走丢了" />
      </div>

      <div class="error-page__info">
        <h1 class="error-page__code">404</h1>
        <p class="error-page__quote">哎呀，迷路了</p>
        <p class="error-page__desc">
          你访问的页面可能被搬走了、删掉了，或者压根就没存在过，<br
            class="error-page__break"
          /><span class="error-page__tail">
            点击 <a class="error-page__link" @click="goHome">返回首页</a>
          </span>
        </p>
      </div>
    </div>

    <footer class="error-page__footer">
      <img class="error-page__logo" :src="logo" alt="洋果教育" />
      <span>洋果教育 · 越学习，越年轻</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * 404 页面
 * @description 路由匹配不到时由 /:pathMatch(.*)* 重定向到这里
 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import iconLose from '@/assets/404/icon_lose.svg?url';
import logo from '@/assets/logo.svg?url';

const router = useRouter();

function goHome(): void {
  router.push('/home');
}

onMounted(() => {
  document.title = '洋果教育 - 页面走丢了';
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>

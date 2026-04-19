<template>
  <div class="layout">
    <header>
      <LayoutHeader />
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <LayoutFooter />
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LayoutHeader from '@/components/layout/Header.vue'
import LayoutFooter from '@/components/layout/Footer.vue'

// 组件名称
defineOptions({
  name: 'Layout'
})

// 响应式主题状态
const currentTheme = ref('light')

// 设置主题
const setTheme = () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// 生命周期：挂载后设置主题
onMounted(() => {
  setTheme()
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>

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
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 10px;

  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
    z-index: 10000;
    background-color: #ffffff;
  }

  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 72px;
    padding-top: 15px;

    // 内容区维持 1200 居中
    :deep(.home) {
      width: 1200px;
    }
  }

  footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
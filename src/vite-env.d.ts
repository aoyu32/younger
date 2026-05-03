/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 删除下面这些
declare module 'swiper/css' {}
declare module 'swiper/css/effect-coverflow' {}
declare module 'swiper/css/pagination' {}
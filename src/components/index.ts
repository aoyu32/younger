// src/components/index.ts
import type { App } from 'vue';
import AoIcon from './ao-icon/index.vue';
import AoPage from './ao-page/index.vue';
import AoImage from './ao-image/index.vue';
import AoButton from './ao-button/index.vue';
import AoInput from './ao-input/index.vue';
import AoScrollbar from './ao-scrollbar/index.vue';
import AoDialog from './ao-dialog/index.vue';
import AoPagination from './ao-pagination/index.vue';
import AoImagePreview from './ao-image-preview/index.vue';
import AoVideoPlayer from './ao-video-player/index.vue';
import AoTooltip from './ao-tooltip/index.vue';
import AoLoading from './ao-loading/index.vue';
import AoMessage from './ao-message/index.vue';
import { message } from './ao-message';

const components = [
  AoIcon,
  AoPage,
  AoImage,
  AoButton,
  AoInput,
  AoScrollbar,
  AoPagination,
  AoImagePreview,
  AoVideoPlayer,
  AoTooltip,
  AoLoading,
  AoMessage,
];

export default {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name!, component);
    });

    // 命令式消息：任何地方都能用 this.$message.success(...)
    // 请求拦截器等非组件场景请直接 import { message } from '@/components/ao-message'
    app.config.globalProperties.$message = message;
  },
};

declare module 'vue' {
  interface ComponentCustomProperties {
    $message: typeof message;
  }
}

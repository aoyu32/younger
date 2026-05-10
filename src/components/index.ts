// src/components/index.ts
import type { App, Component } from 'vue';
import AoIcon from './ao-icon/index.vue';
import AoPage from './ao-page/index.vue';
import AoImage from './ao-image/index.vue';
import AoButton from './ao-button/index.vue';

const components = [AoIcon, AoPage, AoImage, AoButton];
export default {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name!, component);
    });
  },
};

// 自动维护全局导入组件
// const modules = import.meta.glob('./*/index.vue', { eager: true })
// export default {
//   install(app: App) {
//     Object.entries(modules).forEach(([, module]) => {
//       const component = (module as any).default as Component
//       if (component.name) {
//         app.component(component.name, component)
//       }
//     })
//   }
// }
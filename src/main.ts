import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'overlayscrollbars/overlayscrollbars.css';
import '@/style/index.scss';
import AoComponents from '@/components/index';
import useStore from '@/store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(AoComponents);

async function bootstrap(): Promise<void> {
  const { user: userStore } = useStore();
  try {
    await userStore.loadProfile();
  } catch {
    userStore.logout();
  }
  app.use(router);
  app.mount('#app');
}

void bootstrap();

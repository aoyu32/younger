import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'overlayscrollbars/overlayscrollbars.css';
import '@/style/index.scss';
import AoComponents from '@/components/index';
import { getUserProfile } from '@/api/user';
import { useUserStore } from '@/store/module/user';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(AoComponents);

async function bootstrap(): Promise<void> {
  const userStore = useUserStore(pinia);
  try {
    const userInfo = await getUserProfile({
      silent: true,
      skipAuthRedirect: true,
    });
    userStore.login(userInfo);
  } catch {
    userStore.logout();
  }
  app.mount('#app');
}

void bootstrap();

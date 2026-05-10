import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/style/index.scss';
import AoComponents from '@/components/index';

const app = createApp(App);
app.use(router);
app.use(AoComponents);
app.mount('#app');

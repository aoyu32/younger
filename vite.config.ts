import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) =>
              tag.startsWith('media-') || tag === 'video-player',
          },
        },
      }),
      svgLoader(),
    ],
    server: {
      port: Number(env.VITE_APP_PORT),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});

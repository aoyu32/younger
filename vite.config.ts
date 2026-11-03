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
      // 监听 0.0.0.0，局域网内手机可通过电脑 IP 访问
      host: true,
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        // 后端接口走同源代理，避免跨域与 Cookie 的 SameSite 限制
        '/api': {
          target: 'http://localhost:8090',
          changeOrigin: true,
        },
        // 对象存储图片同样走同源代理，手机访问无需单独放行 MinIO 端口
        '/younger': {
          target: 'http://localhost:9000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});

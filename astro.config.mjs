import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const root = path.dirname(fileURLToPath(import.meta.url));

// build 按 production 预构建 jsx-dev-runtime 时，jsxDEV 会变成 undefined。
// 1) build / serve 拆开缓存；2) serve 时不预构建 jsx-dev-runtime，走 Vite 现场转换。
function reactDevRuntimeGuard() {
  return {
    name: 'react-dev-runtime-guard',
    config(_userConfig, { command }) {
      if (command === 'serve') {
        return {
          cacheDir: path.join(root, 'node_modules/.vite/dev'),
          optimizeDeps: {
            exclude: ['react/jsx-dev-runtime'],
          },
        };
      }

      return {
        cacheDir: path.join(root, 'node_modules/.vite/build'),
      };
    },
  };
}

// 用户站仓库，页面在域名根路径，不需要 base。
export default defineConfig({
  site: 'https://esliesliu.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.endsWith('/rss.xml') && !page.endsWith('/rss.xml/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss(), reactDevRuntimeGuard()],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'motion/react',
        'gsap',
        'gsap/ScrollTrigger',
      ],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});

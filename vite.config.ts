/* eslint-disable react-hooks/rules-of-hooks */
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import replace from '@rollup/plugin-replace';
import mkcert from 'vite-plugin-mkcert';
import { resolve } from 'path';

// 使用 vite base config 配置 public path 为相对路径，以支持分支部署到 nested folder 中
const currentBranch = process.env.CI_COMMIT_REF_SLUG;
const defaultBranch = process.env.CI_DEFAULT_BRANCH;
const testBranch = process.env.CI_TEST_BRANCH;
const isMerging = !!process.env.CI_MERGE_REQUEST_ID;

const publicPath =
  currentBranch === defaultBranch || (currentBranch === testBranch && !isMerging) // test 合并到 master 时 也能产生预览环境
    ? '/'
    : currentBranch
    ? `/${currentBranch}/`
    : '/';

// https://vitejs.dev/config/
export default args =>
  defineConfig({
    plugins: [
      mkcert() as any,
      reactRefresh(),
      {
        ...replace({
          include: ['src/App.tsx'],
          antdPlaceHolder: 'true && <AntdCss/>',
          preventAssignment: true,
        }),
        enforce: 'pre', // 确保在 vite 核心插件执行前替换代码，否则会在编译后替换导致无效报错
        apply: 'serve', // 仅在本地 serve 模式下生效
      },
    ],
    base: publicPath,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      https: true,
      host: 'local.zhenguanyu.com',
      port: 3000,
      cors: true,
      proxy: {
        // '/gateway-cn-test': {
        //   target: 'http://10.1.102.25:8080',
        //   changeOrigin: true,
        // },
      },
    },
    build: {
      rollupOptions: {
        output: [
          {
            // eslint-disable-next-line consistent-return
            manualChunks: id => {
              if (id.includes('node_modules') && id.includes('react')) {
                return 'vendor-react';
              }
            },
          },
        ],
      },
    },
  });

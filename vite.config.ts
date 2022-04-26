import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  resolve: {
    alias: {
      // 配置别名
      '@': path.resolve(__dirname, './src'),
      '@img': path.resolve(__dirname, '/static')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${path.join(__dirname, './src/assets/less/base.less')}";`
        },
        additionalData: '@import "./src/assets/less/global.less";',
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    vue(),
  ],
  build: {
    assetsDir: 'static'
  },
  publicDir: 'public'
})

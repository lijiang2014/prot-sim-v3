import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
const AutoImport = require('unplugin-auto-import/vite')
const Components = require('unplugin-vue-components/vite')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')


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
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({enabledCollections: ['ep']}),
      ],
    }),
    Icons({autoInstall: true}),
  ],
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     // console.log(id, "====")
        //     const bigPackage = 'element-plus'
        //     if (id.toString().split('node_modules/')[1].split("/")[0].includes(bigPackage)) {
        //       return bigPackage
        //     }
        //     return "wq"
        //   }
        // }
        // manualChunks: {
        //   'element-plus': ['element-plus'],
        // }
      }
    },
  },
  publicDir: 'public'
})

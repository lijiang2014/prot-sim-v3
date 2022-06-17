import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
import externalGlobals from 'rollup-plugin-external-globals'
import commonjs from 'rollup-plugin-commonjs'
// import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { viteMockServe } from "vite-plugin-mock"
// import styleImport from 'vite-plugin-style-import'
// const AutoImport = require('unplugin-auto-import/vite')
// const Components = require('unplugin-vue-components/vite')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')


// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //   __VUE_I18N_FULL_INSTALL__: true,
  //   __VUE_I18N_LEGACY_API__: false,
  //   __INTLIFY_PROD_DEVTOOLS__: false,
  // },
  // alias: {
  // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
  // },
  resolve: {
    alias: {
      // 配置别名
      '@': path.resolve(__dirname, './src'),
      '@img': path.resolve(__dirname, '/static'),
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
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
    // styleImport
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    viteMockServe({
      supportTs: true,
    }),
    // Components({
    // resolvers: [
    //     ElementPlusResolver(),
    //     IconsResolver({ enabledCollections: ['ep'] }),
    //   ],
    // }),
    // Icons({ autoInstall: true }),
    // vueI18n({
    //   compositionOnly: false,
    //   include: path.resolve(__dirname, "src/i18n/**"),
    // }),
  ],
  build: {
    assetsDir: 'static',
    rollupOptions: {
      external: ['molstar/build/viewer/molstar',],
      plugins: [
        commonjs(),
        externalGlobals({
          'molstar/build/viewer/molstar': 'molstar/build/viewer/molstar'
        }),
      ],
      output: {
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     const packageMap = {
        //       'lodash-es': 'ep',
        //       'element-plus': 'ep',
        //       '@element-plus': 'ep',
        //       '@ctrl': 'ep',
        //       'axios': 'ep',
        //       'vuex': 'ep',
        //       'vue-router': 'ep',
        //       'vue-i18n': 'ep',
        //       '@vue': 'ep',
        //     }
        //     const bigPackage = 'lodash-es'
        //     const pname = id.toString().split('node_modules/')[1].split("/")[0]
        //     if (pname.includes(bigPackage)) {
        //       return bigPackage
        //     }
        //     if (Object.keys(packageMap).indexOf(pname) >= 0) {
        //       return packageMap[pname]
        //     }
        //     console.log(id, "====")
        //     // return "others-" + pname
        //     return "others"
        //   }
        // }
        // manualChunks: {
        //   'element-plus': ['element-plus'],
        // }
      }
    },
    // commonjsOptions: {
    // requireReturnsDefault: "namespace",
    // },
  },
  publicDir: 'public'
})

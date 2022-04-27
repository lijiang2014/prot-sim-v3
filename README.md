# 开发环境

* Vue 3 + TypeScript + Vite
* + vue-router，vuex
* + element-plus
> https://zhuanlan.zhihu.com/p/354373454
* aysnc route
> https://www.jianshu.com/p/4b6a0ded25da
> https://github.com/xuqinglong/vue3/

## 本地开发说明

需要设置 /etc/hosts:

127.0.0.1 localhost bio.nscc-gz.cn

启动项目后，通过 http://bio.nscc-gz.cn:3000/ 访问项目

# Vue 3 + TypeScript + Vite
This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.
## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
## Type Support For `.vue` Imports in TS
Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:
1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.
You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## 移植进度

- [x] login 
- [x] structure prediciton/sumit
- [ ] structure prediciton/queue
- [ ] test/svg
- [ ] test/pdbmolstar
- [ ] test/phylotree
- [ ] structure prediciton/example

暂缓：

- [ ] structure similarly/sumit
- [ ] structure similarly/duf
- [ ] structure prediciton/example
- [ ] BLAST/submit
- [ ] BLAST/queue
- [ ] BLAST/CD
- [ ] BLAST/CDQ
。。。

添加

- [x] Framework
  - [x] 通过 env 来配置项目
  - [x] 通过 vuex 来记录状态
  > https://vuex.vuejs.org/zh/guide/composition-api.html
  > Example About Page
  - [ ] Element UI 按需引入 ~Later
  > https://blog.csdn.net/sayUonly/article/details/121100230
  - [x] i18N
- [x] Starlight Login
- [ ] Apps
- [ ] GraphPPIS
  - [x] 手动模式
  - [ ] iframe 模式
- [ ] Queue
  - [ ] RAW ~TODO
  - [ ] ALPHA 
- [ ] Result
  - [x] RAW
  - [ ] Linked Viewer
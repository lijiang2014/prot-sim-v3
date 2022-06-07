import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '@/components/About.vue'
import Layout from '@/Layout.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true, title: 'login' },
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
  },
  {
    path: '/', redirect: '/apps', meta: { hidden: false, title: 'Home' },
    component: Layout,
    children: [
      // 
      {
        path: '/apps',
        meta: { title: 'Apps' },
        component: () => import('@/views/applist/index.vue')
      },
      {
        path: '/welcome',
        meta: { title: 'Welcome', hidden: true },
        component: () => import('@/views/Welcome.vue')
      },
    ]
  },
  // Structure Prediction
  {
    path: '/app', meta: { hidden: false, title: 'appList' },
    component: Layout,
    children: [
      // 通用 动态表单应用
      {
        path: '/app/:name',
        name: 'AppForm',
        meta: { title: 'AppForm', hidden: true },
        component: () => import('@/views/app/dynamicForm.vue')
      },
      // 结构预测
      {
        path: '/predict/structure/',
        meta: { title: 'structurePrediction' },
        component: () => import('@/views/structure/prediction.vue')
      },
      {
        path: '/predict/structure/queue/',
        meta: { title: 'structureSimilarity' },
        component: () => import('@/views/similarity/structureSimilarity.vue')
      },
    ]
  },
  // Job
  {
    path: '/job', meta: { hidden: false, title: 'Jobs' },
    component: Layout,
    children: [
      {
        path: '/job/all',
        meta: { title: 'List' },
        component: () => import('@/views/queue/all.vue')
      },
      {
        path: '/job/result/:id',
        name: 'jobResult',
        meta: { title: 'result' },
        component: () => import('@/views/jobs/result/index.vue')
      },
      {
        path: '/job/example',
        meta: { title: 'Queue' },
        component: () => import('@/views/jobs/index.vue'),
      },
    ]
  },
  // BLAST
  {
    path: '/blast', redirect: '/blast/submit', meta: { hidden: false, title: 'BLAST' },
    component: Layout,
    children: [
      // 序列相似性 blast
      { path: '/blast/submit', component: About, meta: { hidden: false, title: 'BLAST' } },
    ]
  },
  // About
  {
    path: '/about', redirect: '/about/about', meta: { hidden: false, title: 'About' },
    component: Layout,
    children: [
      { path: '/about/about', component: About, meta: { hidden: false, title: 'About' } },
    ]
  },
  // ...
  {
    path: '/later', meta: { hidden: false, title: 'Tests' },
    component: Layout,
    children: [
      {
        path: '/later/graph-ppis',
        meta: { hidden: false, title: 'graph-ppis' },
        component: () => import('@/views/app/graph-ppis/form.vue')
      },
      {
        path: '/later/graph-ppis/result/example', name: 'jobSpecResult',
        meta: { hidden: false, title: 'graph-ppis-result' },
        component: () => import('@/views/app/graph-ppis/result.vue')
      },
      {
        path: '/later/graph-ppis/result/graphppis', name: 'result-graphppis',
        meta: { hidden: true, title: 'graph-ppis-result' },
        // component: () => import('@/views/app/graph-ppis/result.vue')
        component: () => import('@/views/jobs/result/index.vue')
      },
      {
        path: '/later/graph-ppis/result/:id',
        meta: { hidden: true, title: 'graph-ppis-result' },
        component: () => import('@/views/app/graph-ppis/result.vue'),
      },
      {
        path: '/later/wrf',
        meta: { title: 'wrf' },
        component: () => import('@/components/WebRemoteFinder/input.vue'),
      },
      {
        path: '/later/test/pdbMolstar',
        meta: { title: 'pdb-molstar' },
        component: () => import('@/views/test/pdbMolstar/index.vue')
      },
      {
        path: '/later/test/example',
        meta: { title: 'example' },
        component: () => import('@/views/test/example/index.vue')
      },
      {
        path: '/later/test/mockApi',
        meta: { title: 'MockApi' },
        component: () => import('@/views/test/MockApi/index.vue')
      },
      {
        path: '/later/test/edit',
        meta: { title: '应用编辑' },
        component: () => import('@/views/test/edit/index.vue')
      },
    ]
  },
  // Hidden
  {
    path: '/hide',
    name: 'Hide',
    component: Layout,
    meta: { title: 'hidden', hidden: true },
    children: [
      // 测试页面
      // 队列
      { path: '/queue', component: About },
      // Help
      {
        path: '/help', component: About,
        children: [
          { path: '/sequence/blast/doc/psiblast', component: About },
          { path: '/sequence/blast/doc/jackhmmer', component: About },
        ]
      },
      // molstar
      { path: '/molstar', component: About },
    ]
  },
  // Debug Direct without layout
  {
    path: '/debug',
    name: 'debug',
    component: () => import('@/views/jobs/index.vue'),
    meta: { title: 'hidden', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/notfound.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(''),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   return {
  //     el: '#app',
  //     top: 0,
  //     behavior: 'smooth',
  //   }
  // },
})
export default router
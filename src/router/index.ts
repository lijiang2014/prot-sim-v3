import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '@/components/About.vue'
import Layout from '@/Layout.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true, title: 'login' },
    component: () =>
      import('../views/Login.vue'),
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
        path: '/apps/man', name: "appManager",
        meta: { title: 'Apps Manager', hidden: true },
        component: () => import('@/views/applist/AppMan.vue')
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
        path: '/job/result/:uuid',
        name: 'jobResult',
        meta: { title: 'result', hidden: true },
        component: () => import('@/views/jobs/result/index.vue')
      },
      {
        path: '/job/list',
        name: 'jobList',
        meta: { title: 'Queue' },
        component: () => import('@/views/jobs/index.vue'),
      },
    ]
  },
  // Statistic
  {
    path: '/statistic', meta: { hidden: false, title: 'Statistic' },
    component: Layout,
    children: [
      {
        path: '/statistic/app',
        component: () => import('@/views/statistic/index.vue'),
        meta: { hidden: false, title: 'Statistic' }
      },
    ]
  },
  // About
  {
    path: '/about', redirect: '/about/about', meta: { hidden: true, title: 'About' },
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
        path: '/later/saguaro',
        meta: { hidden: false, title: 'saguaro' },
        component: () => import('@/views/test/saguaro/index.vue')
      },
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
        path: '/later/graph-ppis/result/graphppis/:uuid', name: 'result-graph-ppis',
        meta: { hidden: true, title: 'graph-ppis-result' },
        // component: () => import('@/views/app/graph-ppis/result.vue')
        component: () => import('@/views/jobs/result/index.vue')
      },
      {
        path: '/later/wrf',
        meta: { title: 'wrf' },
        component: () => import('@/components/WebRemoteFinder/input.vue'),
      },
      {
        path: '/later/test/cifMolstar',
        meta: { title: 'cif-molstar' },
        component: () => import('@/views/test/cifMolstar/index.vue')
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
        path: '/later/test/userInfo', name: "userInfo",
        meta: { title: 'userInfo' },
        component: () => import('@/views/test/userInfo.vue')
      },
      {
        path: '/later/test/edit',
        meta: { title: '应用编辑' },
        component: () => import('@/views/test/edit/index.vue')
      },
      {
        path: '/later/test/enigma',
        meta: { title: 'enigma' },
        component: () => import('@/views/test/enigma/index.vue')
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
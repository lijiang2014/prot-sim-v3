import { createApp } from 'vue'
import { store, key } from './store'
import App from './App.vue'
import router from './router'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import * as icons  from '@element-plus/icons-vue'
import initStorePersistence from '@/store/persistence'

import '@/assets/global.css'
// import '@/assets/index.css'

import i18n from './i18n'

const app = createApp(App)
// for (const name in icons){
// 	app.component(name,(icons as any)[name])
// }

initStorePersistence(store)
app.use(store, key)
// app.use(ElementPlus).
app.use(i18n)
app.use(router)
app.mount('#app')
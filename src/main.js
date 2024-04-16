import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/permission' // permission control
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import '@/styles/themes.scss'
import {appStore} from '@/stores/app'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
// 设置初始主题颜色
const store = appStore()
document.documentElement.style.setProperty('--color-background-light', store.themeColor)
document.documentElement.style.setProperty('--color-text-light', store.themeColorText)
app.mount('#app')

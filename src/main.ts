/// <reference types="vite-plugin-pwa/client" />
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // We can show a prompt here if we want manual updates, but registerType is autoUpdate
  },
  onOfflineReady() {
    console.log('App is ready for offline use.')
  },
})

createApp(App).mount('#app')

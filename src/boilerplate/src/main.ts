/**
 * main.ts
 *
 * Bootstraps plugins then mounts the App`
 */

// Styles
import '@ogen-assets/css/animate.css'
import '@ogen-assets/scss/root.scss'
import '@ogen-assets/scss/themes.scss'
import '@ogen-assets/scss/components.scss'
import '@ogen-assets/scss/animations.scss'
import '@ogen-assets/scss/fonts.scss'
// Components
import App from './App.vue'

// Composables

import { createApp } from 'vue'
// import {} from '@/client/services.gen'
import { createHead } from '@unhead/vue'
import { i18n } from "@ogen-core"
import router from "./app.router";

const app = createApp(App)

// app.use(axios, { router })

app.use(router)
app.use(i18n)
app.use(createHead())

app.mount('#app')

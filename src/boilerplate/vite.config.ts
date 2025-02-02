// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
// import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// Utilities
import { defineConfig, loadEnv } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { alias } from './vite.aliases'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    Components({
      dts: "src/components.d.ts",
      dirs: ["src/components"],
      deep: true, // ✅ Inclure les sous-dossiers de `components`
      directoryAsNamespace: true, // ✅ Permet d'organiser les composants par dossier
      resolvers: [],
    }),
    Vue({
      // template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    // Vuetify({
    //   // autoImport: true,
    //   // styles: {
    //   //   configFile: 'src/styles/settings.scss'
    //   // }
    // }),
    {
      name: 'inject-environment-variables',
      apply: 'build',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: {
              type: 'text/javascript',
              src: '/env.js'
            }
          }
        ]
      }
    }
  ],
  resolve: {
    alias
  },
  worker: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: Infinity,
        chunkFileNames: `[name].js`,
        entryFileNames: 'assets/worker.js',
        assetFileNames: 'assets/[name].[extname]',
      }
    }
  },
  define: {
    env: loadEnv(mode, process.cwd())
  }
}))

import type { Ref } from 'vue';
import { reactive, computed, toRef } from 'vue'
import Package from '../../../../../../../package.json'

import useLocalStorage from '@ogen-composables/useLocalStorage'

console.log(Package);
export const ram = {
  version: Package.version,
  redirect: useLocalStorage<string>('nextUrl', '' as string),
}

type TAppReactives = {
  theme: Ref<string, string>;
  lang: Ref<string, string>
  graphic: Ref<number, number>
  settings: any
  layout: {
    name: string
    props: any
  }
}

export const reactives = reactive<TAppReactives>({
  theme: useLocalStorage('theme', 'light'),
  lang: useLocalStorage('lang', 'fr'),
  graphic: useLocalStorage('graphic', 3),
  settings: useLocalStorage('settings', {}),
  layout: {
    name: 'default',
    props: {},
  }
})

// Arch exports;
export default {
  reactives: toRef(reactives),
  ram
}

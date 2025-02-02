import { ModuleCore } from '@ogen-core'
import { nextConsole } from '@ogen-composables/helpers/useDevTools'
import type { ComputedRef, Ref } from 'vue'
import { ref, computed } from 'vue';
import langs from './module.lang';

const isProduction = process.env.NODE_ENV === 'production'


let console = nextConsole('Module[{{EntityName}}]', { color: '#FFFFFF', background: '#980303' })

export interface I{{EntityName}}Module {
  myRef: Ref<any>
  myComputed: ComputedRef<boolean>
}

export default class {{EntityName}}Module extends ModuleCore implements I{{EntityName}}Module {
  static NAMESPACE = '{{EntityNameLowercase}}'

  myRef: Ref<any>
  myComputed: ComputedRef<any>

  constructor() {
    console.log('Construct')
    super({ id: {{EntityName}}Module.NAMESPACE })

    this.init().finally()
  }

  async init() {


    this.myRef = ref(null)
    this.myComputed = computed(() => this.myRef.value);

    watch(this.myComputed, (next, last) => {

    })

    this.setIsReady(true)
  }
}

import type { ComputedRef, Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { nextConsole } from '@ogen-composables/helpers/useDevTools'
import { clientData } from '@modules/authorizer/composables/useClientData.ts'

export const actionConsole = nextConsole('App[ACTION]', {
  color: 'white',
  backgroundColor: '#8c0000'
})

type TAppStates = {
  showMenu: boolean
}

type TAppGetters = {
  clientData: ComputedRef<any>
}

/**
 * Refs
 */

export const refs = {
  menu: ref(null)
}
/**
 * States
 */
export const states = reactive<TAppStates>({
  showMenu: false
})

/**
 * Getters
 */
export const getters = {
  clientData: computed(() => clientData.value)
} as TAppGetters

export default {
  states,
  getters
}

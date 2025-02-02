import type { ComputedRef, Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { nextConsole } from '@ogen-composables/helpers/useDevTools'
import { clientData } from '@modules/authorizer/composables/useClientData.ts'

export const actionConsole = nextConsole('Settings[ACTION]', {
  color: 'white',
  backgroundColor: '#8c0000'
})

type TSettingsStates = {

}

type TSettingsGetters = {
  clientData: ComputedRef<any>
}

/**
 * Refs
 */

export const refs = {
}
/**
 * States
 */
export const states = reactive<TSettingsStates>({
})

/**
 * Getters
 */
export const getters = {
  clientData: computed(() => clientData.value)
} as TSettingsGetters

export default {
  states,
  getters
}

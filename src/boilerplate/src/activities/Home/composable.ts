import { reactive, computed, watch } from 'vue';

import { nextConsole } from "@ogen-composables/helpers/useDevTools";

export const actionConsole = nextConsole('Home[ACTION]', { color: 'white', backgroundColor: '#8c0000' });

/**
 * Refs
 */
export const refs = {

}

/**
 * States
 */
export const states = reactive({

});

/**
 * Getters
 */
export const getters = {
	states: computed(() => states),
};

export default {
	states,
	getters,
}
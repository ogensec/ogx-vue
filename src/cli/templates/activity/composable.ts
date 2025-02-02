import { reactive, computed, watch } from 'vue';

import { nextConsole } from "@ogen-composables/helpers/useDevTools";

export const actionConsole = nextConsole('{{EntityName}}[ACTION]', { color: 'white', backgroundColor: '#8c0000' });

/**
 * Refs
 */
export const refs = {
	controller: null,
}

/**
 * States
 */
export const states = reactive({
	isReady: false
});

/**
 * Getters
 */
export const getters = {
	states: computed(() => states.isReady),
};

export default {
	states,
	getters,
}
import type { ComputedRef, Ref } from "vue";
import { computed, reactive, watch } from "vue"
import { ModuleCore } from "@ogen-core";


type TModuleDefinition = {
	id: string;
	condition:  ComputedRef<boolean> |  ComputedRef< ComputedRef<boolean>>;
	module: () => ModuleCore
}

type TModuleMemory = {
	id: string;
	condition: ComputedRef<boolean> |  ComputedRef< ComputedRef<boolean>>;
	module: ModuleCore
}


export const states = reactive({
	modules: {} as Ref<{ [key: string]: TModuleMemory }>,
	queueImportModules: [],
	queueLoadModules: [],
	message: null,
	errors: [],
	// component: shallowRef(ModulesManagerComponent)
})

export const getters = {
	modules: computed(() => states.modules),
	isLoading: computed(() => {
		let x = 0;
		let y = 0;
		for (let id in states.modules) {
			y++;
			// console.log('module',states.modules)
			// console.log('isLoading',states.modules[id]?.module?.isLoading);
			// console.log('isReady',states.modules[id]?.module?.isReady);
			if ((states.modules[id as keyof typeof states.modules] as any)?.module?.isReady) {
				x++;
			}
			// else {
			// 	console.log(id, 'is not ready')
			// }
		}
		return x !== y;
	}),
	loadingMessage: computed(() => {
		for (let module in states.modules) {
			if (states.modules[module]?.module?.message)
				return states.modules[module].module.message
		}
		return null;
	})
}


export function declareModule<ModuleInterface>(moduleDefinition: TModuleDefinition) {
	if (!states.modules[moduleDefinition.id]) {
		// console.log('CHECK condition', moduleDefinition.id, moduleDefinition.condition);
		if (moduleDefinition.condition.value) {
			states.modules[moduleDefinition.id] = {
				id: moduleDefinition.id,
				condition: moduleDefinition.condition,
				module: moduleDefinition.module(),
			}
		}

		watch(moduleDefinition.condition, (prev, next) => {
			if (!prev && next) {
				if (states.modules[moduleDefinition.id].module['beforeUnmount'])
					states.modules[moduleDefinition.id].module.beforeUnmount();
				
				delete states.modules[moduleDefinition.id];
			}
			else if (prev && !next) {
				states.modules[moduleDefinition.id] = {
					id: moduleDefinition.id,
					condition: moduleDefinition.condition,
					module: moduleDefinition.module(),
				}
			}
		})
	}

	return getters.modules.value[moduleDefinition.id]?.module as ModuleInterface
}

export function useModule<T>(moduleName: string) {

	if (getters.modules.value[moduleName]?.module)
		return getters.modules.value[moduleName]?.module as T
}

export default {
	states,
	getters,
	declareModule,
	useModule,
}
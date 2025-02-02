import type { ComputedRef } from 'vue';
import { ref, reactive, computed, watch } from 'vue';

type ApiErrors = {
	[key: string]: string[] | undefined;
}

type IncomeErrors = {
	type: string;
	message: string;
	code: number;
}

type Input = {
	REF: any;
	NAME: string;
}

type ApiErrorsResponse = {
	pushErrors(incomeErrors: IncomeErrors): void
	inErrors: ComputedRef<any>
	haveErrors: ComputedRef<any>
	getErrorsIndexes(index?: string | string[]): any | any[]
	watchInputs(inputs: Record<string, Input>): void
	resetErrors(): void;
}

const SYSTEM_ERRORS = [ 'api', 'internal' ];

//need to be a reactives
const errorIndexesCache = reactive(new Map());

function useApiErrors(): ApiErrorsResponse {
	let errors = ref<ApiErrors>({});

	function pushErrors(incomeErrors: IncomeErrors[]) {

		for (let error of incomeErrors) {
			if (!errors.value[error.type]) errors.value[error.type] = [];
			errors.value[error.type].push({ code: error.code, message: error.message })
		}

	}

	function removeErrors(index: string) {
		delete errors.value[index];
	}

	const inErrors = computed(() => {
		return errors.value;
	});

	const getErrorsIndexes = (index?: string | string[]) => {
		const key = JSON.stringify(index); 

		if (errorIndexesCache.has(key)) {
			return errorIndexesCache.get(key);
		}

		const computedErrors = computed(() => {
			if (index === undefined) {
				return errors.value;
			} else if (index) {
				if (typeof index === 'string') index = [index];
				return index.flatMap((i) => {
					if (!errors.value[i]) return [];
					return errors.value[i].map((e) => {
						return {
							index: `errors.${i}_${e.message}`,
							raw: `${i} : ${e.message}`
						};
					});
				});
			} else {
				return [];
			}
		});

		errorIndexesCache.set(key, computedErrors);
		return computedErrors
	};
	const haveErrors = computed(() => {
		return !!Object.keys(errors.value).length;
	});

	const resetErrors = () => {
		errors.value = {};
		errorIndexesCache.clear();
	};

	function watchInputs(inputs: Record<string, Input>) {
		for (let key in inputs) {
			const input = inputs[key];
			watch(input.REF, () => {
				removeErrors('api');
				removeErrors(input.NAME);
			});
		}
	}

	return {
		pushErrors,
		inErrors,
		haveErrors,
		getErrorsIndexes,
		watchInputs,
		resetErrors,
	};
}

export default useApiErrors;
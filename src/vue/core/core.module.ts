import type { ComputedRef, Ref } from "vue";
import { ref, computed } from "vue";
import { consoleModule as console } from "./index";

export default class ModuleCore {

	id: string;
	isLoading: ComputedRef<boolean>;
	isLoaded: Ref<boolean>;
	isReady: Ref<boolean>;
	errors: Ref<string[]>;
	message: Ref<string | null>;

	constructor({ id }: { id: string}) {
		console.log('construct', id);
		this.id = id;
		this.isLoading = computed(() => { return !this.isLoaded.value })
		this.isLoaded = ref(false)
		this.isReady = ref(false)

		this.errors = ref([]);
		this.message = ref(null);

	}
	
	setIsLoaded(value: boolean) {
		if (value) {
			this.isLoaded.value = value
		}
	}

	setIsReady(value: boolean) {
		if (value) {
			this.isLoaded.value = true;
			this.isReady.value = true;
		}
		
		this.isReady.value = value;
	}

	emitMessage(message: string) {
		if (!message) return this.message.value = null;
		this.message.value = message;
		return this.message;
	}

	getMessage() {
		return this.message
	}

	resetMessage() {
		this.message.value = null;
	}

	pushError(error: string) {
		this.errors.value.push(error);
	}

	resetErrors() {
		this.errors.value = [];
	}

	beforeUnmount() {
		
	}
}

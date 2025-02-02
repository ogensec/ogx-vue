import { computed } from "vue";
// import { useI18n } from "vue-i18n";
import { i18n, injectLocalesMessages, loadLanguageAsync } from "@ogen-core";
import { reactives } from "@ogen-providers/app/memory";

const current = computed(() => reactives.lang);
const set = async (value: string) => {
	await loadLanguageAsync(value);
	reactives.lang = value;
}

export const InjectLocalesMessages = injectLocalesMessages;

export default () => {
	// const i18n = useI18n({ useScope: 'global'});
	//
	// console.log('i18n',i18n)
	return {
		
		PRINT: i18n.global.t as (index: string) => string,
		current,
		InjectLocalesMessages,
		set,
	}
}

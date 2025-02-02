import { computed } from 'vue';
import { reactives } from '@ogen-providers/app/memory';

export default () => {
	
	const current = computed(() => reactives.theme);
	
	const set = (value: string) => {
		reactives.theme = value as any;
	}
	
	return { current, set }
}
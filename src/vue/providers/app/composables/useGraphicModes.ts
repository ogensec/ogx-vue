import { computed, toRef } from "vue";
import { reactives } from '@ogen-providers/app/memory';

export default () => {


	const current = computed(() => {
		return reactives.graphic;

	})

	const currentName = computed(() => {
		const v = current.value;
		if (v===0) return 'performance';
		else if (v===1) return 'low';
		else if (v===2) return 'medium';
		else return 'high'
	})

	const set = (value: number) => {
		reactives.graphic = value as any;
	}

	return { current, currentName, set }
};
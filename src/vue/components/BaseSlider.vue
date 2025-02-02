<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Item {
	value: string | boolean | number ;
	label: string;
}

type TBaseSliderProps = {
	items: Item[];
	modelValue: string | boolean | number;
	colorThumb: string
	colorThumbBar: string
	labelStyle: Partial<CSSStyleDeclaration>;
}

const defaultLabelStyle: Partial<CSSStyleDeclaration> = { color: 'white' };

const props = withDefaults(defineProps<TBaseSliderProps>(), {
	colorThumb: 'red',
	colorThumbBar: 'white',
	labelStyle: {  color: 'white ' } as any
})
const emit = defineEmits(['update:modelValue']);

const currentIndex = ref(
	props.items.findIndex(item => item.value === props.modelValue)
);

watch(() => props.modelValue, (newValue) => {
	currentIndex.value = props.items.findIndex(item => item.value === newValue);
});

const onInput = () => {
	emit('update:modelValue', props.items[currentIndex.value].value);
};

const getLabelPosition = (index: number) => {
	const totalSteps = props.items.length - 1;
	return `${(index / totalSteps) * 100}%`;
};
</script>

<template>
<div class="base-slider"
:style="{
	'--thumb-color': props.colorThumb,
	'--thumb-bar-color': props.colorThumbBar,
}"
>
	<input
		type="range"
		:min="0"
		:max="items.length - 1"
		:step="1"
		v-model="currentIndex"
		@input="onInput"
		class="slider"
	/>
	<div class="labels">
		<div
			v-for="(item, index) in items"
			:key="index"
			:style="[{ left: getLabelPosition(index) }, props.labelStyle]"
			class="label"
			
		>
			{{ item.label }}
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.base-slider {
	position: relative;
	width: 100%;
	height: 75px;
	display: flex;
	//align-items: center;
	
	.slider {
		width: 100%;
		appearance: none;
		background: transparent;
		display: flex;
		align-items: center;

		&::-webkit-slider-thumb {
			appearance: none;
			width: 20px;
			height: 20px;
			background: var(--thumb-color);
			border-radius: 50%;
			cursor: pointer;
			margin-top: -8px
		}

		&::-moz-range-thumb {
			width: 20px;
			height: 20px;
			background: var(--thumb-color);
			border-radius: 50%;
			cursor: pointer;
		}

		&::-ms-thumb {
			width: 20px;
			height: 20px;
			background: var(--thumb-color);
			border-radius: 50%;
			cursor: pointer;
		}

		&::-webkit-slider-runnable-track {
			height: 3px;
			background: var(--thumb-bar-color);
		}

		&::-moz-range-track {
			height: 5px;
			background: var(--thumb-bar-color);
		}

		&::-ms-track {
			height: 5px;
			background: var(--thumb-bar-color);
		}
	}

	.labels {
		position: absolute;
		top: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;

		.label {
			position: absolute;
			transform: translateX(-50%);
		}
		
		.label:nth-child(1) {
			left: 20px !important;
		}
		
		.label:last-child {
			right: -15px !important;
			left: inherit !important;
		}
	}
}
</style>

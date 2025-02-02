<script setup lang="ts">

import { computed } from 'vue';

type ProgressBarLineProps = {
	height?: number;
	width?: number
	maxStep?: number,
	step?: number,
	colorBarNone?: string;
	colorBarLow?: string;
	colorBarMedium?: string;
	colorBarHigh?: string;

}

const props = withDefaults(defineProps<ProgressBarLineProps>(), {
	height: 30,
	width: 15,
	maxStep: 10,
	step: 2,
	colorBarNone: '#000',
	colorBarLow: 'orange',
	colorBarMedium: 'green',
	colorBarHigh: '#687dfa'
})


const styleComputed = computed(() => {
	return {
		'--pbl-height': props.height + 'px',
		'--pbl-width-bar': props.width + 'px',
		'--pbl-bar-color-none': props.colorBarNone,
		'--pbl-bar-color-low': props.colorBarLow,
		'--pbl-bar-color-medium': props.colorBarMedium,
		'--pbl-bar-color-high': props.colorBarHigh,
	}
})

const getColorByIndex = (index: number) => {
	let activeColor = 'var(--pbl-bar-color-low)'
	if (props.step < Math.round(props.maxStep / 2.7)) activeColor = 'var(--pbl-bar-color-low)'
	else if (props.step >= Math.round(props.maxStep / 2.7)
		&& props.step < Math.round(props.maxStep / 1.7)) {
		activeColor = 'var(--pbl-bar-color-medium)'
	} else activeColor = 'var(--pbl-bar-color-high)'

	if (index <= props.step) return activeColor
	else return 'var(--pbl-bar-color-none)'

}
</script>

<template>
<div class="progress-bar-line" :style="styleComputed">
	<div class="line"
	     v-for="i in props.maxStep"
	     :style="{backgroundColor: getColorByIndex(i)}"
	>
	</div>

</div>
</template>

<style lang="scss">
.progress-bar-line {
	display: flex;

	.line {
		height: var(--pbl-height);
		width: var(--pbl-width-bar);
		padding-left: 2px;
		
		&:first-child {
			border-radius: 4px 0 0 4px;
		}
		&:last-child {
			border-radius: 0 4px 4px 0;
		}
	}
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
	size: {
		type: Number,
		default: 24,
	},
	disabled: {
		type: Boolean,
		default: false,
	}
})

const r = (value: number) => Math.round(value);

const svgValues = computed(() => {
	return {
		viewBox: `0 0 ${props.size} ${props.size}`,
		width: props.size,
		height: props.size,
		circleC: r(props.size / 2),
		circleR: r(props.size / 2.4),
		x: r(props.size / 1.5),
		y: r(props.size / 3)
	}
})

const colorComputed = computed(() => {
	
})
</script>


<template>
<button class="close-button" :class="{ disabled: props.disabled }">
	<svg :viewBox="svgValues.viewBox" class="close-icon"   :height="props.size" :width="props.size">
		<circle :cx="svgValues.circleC" :cy="svgValues.circleC" :r="svgValues.circleR" shape-rendering="geometricPrecision" />
		<line :x1="svgValues.y" :y1="svgValues.y" :x2="svgValues.x" :y2="svgValues.x" />
		<line :x1="svgValues.x" :y1="svgValues.y" :x2="svgValues.y" :y2="svgValues.x" />
	</svg>
</button>
</template>

<style lang="scss">
.close-button {
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
	
	.close-icon {
		stroke-width: 1;


		circle {
			stroke-width: 2;
		}

		line {
			stroke-width: 2;
		}
	}
	
}



</style>
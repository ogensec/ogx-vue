<script setup lang="ts">
import { computed } from 'vue';


type TProps = {
	color?: string
	size?: number
	shadow?: string
}


const props = withDefaults(defineProps<TProps>(), {
	color: 'grey',
	size: 10,
	shadow: undefined,
})

const inPixel = (value: number) => {
	return value + 'px'
}

const styleContainer = computed(() => {
	return {
		'--sp-color': props.color,
		'--sp-width': inPixel(props.size * 6),
		'--sp-width-ball': inPixel(props.size),
		'--sp-shadow': props.shadow || 'none'
	}
})

</script>

<template>
<div class="spinner-balls" :style="{...styleContainer}">
	<div class="ball" id="ball_1">
		<div class="inner"></div>
	</div>
	<div class="ball" id="ball_2">
		<div class="inner"></div>
	</div>
	<div class="ball" id="ball_3">
		<div class="inner"></div>
	</div>
	<div class="ball" id="ball_4">
		<div class="inner"></div>
	</div>
	<div class="ball" id="ball_5">
		<div class="inner"></div>
	</div>
</div>
</template>

<style lang="scss">

.spinner-balls {
	position: relative;
	width: var(--sp-width);
	height: var(--sp-width);


	.ball {
		position: absolute;
		width: var(--sp-width);
		height: var(--sp-width);
		opacity: 0;
		-moz-transform: rotate(225deg);
		-moz-animation: orbit 4.95s infinite;
		-webkit-transform: rotate(225deg);
		-webkit-animation: orbit 4.95s infinite;
		-ms-transform: rotate(225deg);
		-ms-animation: orbit 4.95s infinite;
		-o-transform: rotate(225deg);
		-o-animation: orbit 4.95s infinite;
		transform: rotate(225deg);
		animation: orbit 4.95s infinite;

		&#ball_1 {
			-moz-animation-delay: 1.08s;
			-webkit-animation-delay: 1.08s;
			-ms-animation-delay: 1.08s;
			-o-animation-delay: 1.08s;
			animation-delay: 1.08s;
		}

		&#ball_2 {
			-moz-animation-delay: 0.22s;
			-webkit-animation-delay: 0.22s;
			-ms-animation-delay: 0.22s;
			-o-animation-delay: 0.22s;
			animation-delay: 0.22s;
		}
		&#ball_3 {
			-moz-animation-delay: 0.43s;
			-webkit-animation-delay: 0.43s;
			-ms-animation-delay: 0.43s;
			-o-animation-delay: 0.43s;
			animation-delay: 0.43s;
		}
		&#ball_4 {
			-moz-animation-delay: 0.65s;
			-webkit-animation-delay: 0.65s;
			-ms-animation-delay: 0.65s;
			-o-animation-delay: 0.65s;
			animation-delay: 0.65s;
		}
		&#ball_5 {
			-moz-animation-delay: 0.85s;
			-webkit-animation-delay: 0.85s;
			-ms-animation-delay: 0.85s;
			-o-animation-delay: 0.85s;
			animation-delay: 0.85s;
		}


		.inner {
			background: var(--sp-color);
			//box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
			box-shadow: var(--sp-shadow);
			position: absolute;
			width: var(--sp-width-ball);
			height: var(--sp-width-ball);
			left: 0px;
			top: 0px;
			-moz-border-radius: 11px;
			-webkit-border-radius: 11px;
			-ms-border-radius: 11px;
			-o-border-radius: 11px;
			border-radius: 11px;
		}

	}

	@-moz-keyframes orbit {
		0% {
			opacity: 1;
			z-index: 99;
			-moz-transform: rotate(180deg);
			-moz-animation-timing-function: ease-out;
		}
		7% {
			opacity: 1;
			-moz-transform: rotate(300deg);
			-moz-animation-timing-function: linear;
			-moz-origin: 0%;
		}
		30% {
			opacity: 1;
			-moz-transform: rotate(410deg);
			-moz-animation-timing-function: ease-in-out;
			-moz-origin: 7%;
		}
		39% {
			opacity: 1;
			-moz-transform: rotate(645deg);
			-moz-animation-timing-function: linear;
			-moz-origin: 30%;
		}
		70% {
			opacity: 1;
			-moz-transform: rotate(770deg);
			-moz-animation-timing-function: ease-out;
			-moz-origin: 39%;
		}
		75% {
			opacity: 1;
			-moz-transform: rotate(900deg);
			-moz-animation-timing-function: ease-out;
			-moz-origin: 70%;
		}
		76% {
			opacity: 0;
			-moz-transform: rotate(900deg);
		}
		100% {
			opacity: 0;
			-moz-transform: rotate(900deg);
		}
	}

	@-webkit-keyframes orbit {
		0% {
			opacity: 1;
			z-index: 99;
			-webkit-transform: rotate(180deg);
			-webkit-animation-timing-function: ease-out;
		}
		7% {
			opacity: 1;
			-webkit-transform: rotate(300deg);
			-webkit-animation-timing-function: linear;
			-webkit-origin: 0%;
		}
		30% {
			opacity: 1;
			-webkit-transform: rotate(410deg);
			-webkit-animation-timing-function: ease-in-out;
			-webkit-origin: 7%;
		}
		39% {
			opacity: 1;
			-webkit-transform: rotate(645deg);
			-webkit-animation-timing-function: linear;
			-webkit-origin: 30%;
		}
		70% {
			opacity: 1;
			-webkit-transform: rotate(770deg);
			-webkit-animation-timing-function: ease-out;
			-webkit-origin: 39%;
		}
		75% {
			opacity: 1;
			-webkit-transform: rotate(900deg);
			-webkit-animation-timing-function: ease-out;
			-webkit-origin: 70%;
		}
		76% {
			opacity: 0;
			-webkit-transform: rotate(900deg);
		}
		100% {
			opacity: 0;
			-webkit-transform: rotate(900deg);
		}
	}

	@-ms-keyframes orbit {
		0% {
			opacity: 1;
			z-index: 99;
			-ms-transform: rotate(180deg);
			-ms-animation-timing-function: ease-out;
		}
		7% {
			opacity: 1;
			-ms-transform: rotate(300deg);
			-ms-animation-timing-function: linear;
			-ms-origin: 0%;
		}
		30% {
			opacity: 1;
			-ms-transform: rotate(410deg);
			-ms-animation-timing-function: ease-in-out;
			-ms-origin: 7%;
		}
		39% {
			opacity: 1;
			-ms-transform: rotate(645deg);
			-ms-animation-timing-function: linear;
			-ms-origin: 30%;
		}
		70% {
			opacity: 1;
			-ms-transform: rotate(770deg);
			-ms-animation-timing-function: ease-out;
			-ms-origin: 39%;
		}
		75% {
			opacity: 1;
			-ms-transform: rotate(900deg);
			-ms-animation-timing-function: ease-out;
			-ms-origin: 70%;
		}
		76% {
			opacity: 0;
			-ms-transform: rotate(900deg);
		}
		100% {
			opacity: 0;
			-ms-transform: rotate(900deg);
		}
	}

	@-o-keyframes orbit {
		0% {
			opacity: 1;
			z-index: 99;
			-o-transform: rotate(180deg);
			-o-animation-timing-function: ease-out;
		}
		7% {
			opacity: 1;
			-o-transform: rotate(300deg);
			-o-animation-timing-function: linear;
			-o-origin: 0%;
		}
		30% {
			opacity: 1;
			-o-transform: rotate(410deg);
			-o-animation-timing-function: ease-in-out;
			-o-origin: 7%;
		}
		39% {
			opacity: 1;
			-o-transform: rotate(645deg);
			-o-animation-timing-function: linear;
			-o-origin: 30%;
		}
		70% {
			opacity: 1;
			-o-transform: rotate(770deg);
			-o-animation-timing-function: ease-out;
			-o-origin: 39%;
		}
		75% {
			opacity: 1;
			-o-transform: rotate(900deg);
			-o-animation-timing-function: ease-out;
			-o-origin: 70%;
		}
		76% {
			opacity: 0;
			-o-transform: rotate(900deg);
		}
		100% {
			opacity: 0;
			-o-transform: rotate(900deg);
		}
	}

	@keyframes orbit {
		0% {
			opacity: 1;
			z-index: 99;
			transform: rotate(180deg);
			animation-timing-function: ease-out;
		}
		7% {
			opacity: 1;
			transform: rotate(300deg);
			animation-timing-function: linear;
			origin: 0%;
		}
		30% {
			opacity: 1;
			transform: rotate(410deg);
			animation-timing-function: ease-in-out;
			origin: 7%;
		}
		39% {
			opacity: 1;
			transform: rotate(645deg);
			animation-timing-function: linear;
			origin: 30%;
		}
		70% {
			opacity: 1;
			transform: rotate(770deg);
			animation-timing-function: ease-out;
			origin: 39%;
		}
		75% {
			opacity: 1;
			transform: rotate(900deg);
			animation-timing-function: ease-out;
			origin: 70%;
		}
		76% {
			opacity: 0;
			transform: rotate(900deg);
		}
		100% {
			opacity: 0;
			transform: rotate(900deg);
		}
	}


}

</style>

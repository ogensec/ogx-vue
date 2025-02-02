<script setup lang="ts">
import { DefaultLoader } from "@app-organizer";

const emit = defineEmits([ 'onPress' ]);

const props = defineProps({
	color: {
		type: String,
		default: 'black',
	},
	colorHover: {
		type: String,
		default: 'white',
	},
	spinnerColor: {
		type: String,
		default: 'white',
	},

	background: {
		type: String,
		default: 'none'
	},
	backgroundHover: {
		type: String,
		default: 'none'
	},
	border: {
		type: String,
		default: 'white',
	},
	borderHover: {
		type: String,
		default: 'none'
	},
	loading: {
		type: Boolean,
		default: false,
	},
	shadow: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	size: {
		type: Number,
		default: 27,
	}
})

const onPressButton = () => {
	if (!props.loading && !props.disabled) {
		emit('onPress');
	} 
}



</script>

<template>
<button
	class="base-button-icon"
	:class="[
      {
        loading: props.loading,
        disabled: props.disabled,
      },

    ]"
	@click.prevent="onPressButton"
	:style="{
      '--bb-color': props.color,
      '--bb-color-hover': props.colorHover,
      '--bb-bg': props.background,
      '--bb-bg-hover': props.backgroundHover,
      '--bb-border': props.border,
      '--bb-border-hover': props.borderHover,
      '--bb-size': props.size + 'px',
      '--bb-padding': (props.size / 2) + 'px'
    }"
>
	<DefaultLoader
		v-if="props.loading"
		:color="props.spinnerColor"
		:size="props.size / 5"
		class="pt-1"
	/>
	<slot v-if="!props.loading"/>
</button>
</template>


<style lang="scss">
.base-button-icon {
	color: var(--bb-color);
	border: 1px solid var(--bb-border);
	background-color: var(--bb-bg);
	//width: var(--bb-size);
	//height: var(--bb-size);
	padding: var(--bb-padding);
	
	&:hover {
		color: var(--bb-color-hover);
		border: 1px solid var(--bb-border-hover);
		background-color: var(--bb-bg-hover);
	}
}
</style>
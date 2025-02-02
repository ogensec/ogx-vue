<script setup lang="ts">
import { DefaultLoader } from "@app-organizer";


const emit = defineEmits([ 'onPress' ]);

type TPropsBaseButton = {
  color?: string
  spinnerColor?: string
  spinnerSize?: number
  disabled?: boolean
  background?: string
  border?: string
  loading?: boolean
  shadow?: boolean
}

const props = withDefaults(defineProps<TPropsBaseButton>(), {
  color: 'black',
  spinnerColor:  'white',
  spinnerSize:  3,
  disabled: false,
  background: '#687dfa',
  border:'none',
  loading: false,
  shadow: true,
});



const onPressButton = () => {
	if (!props.loading && !props.disabled) {
		emit('onPress');
	} else {
		console.log('is already loading or disabled');
	}
}


</script>

<template>
<button
	class="base-button"
	:class="[
      {
        loading: props.loading,
        disabled: props.disabled
      },
      props.background
    ]"
	@click.prevent="onPressButton"
	:style="{
      '--qb-color': props.color,
      '--qb-border': props.border,
      'box-shadow': props.shadow ? '0 2px 5px 0px rgba(0, 0, 0, 0.2)' : 'none',
    }"
>
	<DefaultLoader
		v-if="props.loading"
		:color="props.spinnerColor"
		:size="props.spinnerSize"
		class="pt-1"
	/>
	<slot v-if="!props.loading"/>
</button>
</template>


<style lang="scss">

</style>
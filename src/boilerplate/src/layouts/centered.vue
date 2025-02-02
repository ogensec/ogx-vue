<script setup lang="ts">

import { computed } from 'vue';
import { getURLPath } from "@ogen-composables/helpers/useDevTools";

const props = defineProps({
	backgroundUrl: {
		type: String,
		default: null,
	},
	backgroundColor: {
		type: String,
		default: null,
	}
})

const stylesDynamics = computed(() => ({
	...(props.backgroundUrl ? {
		backgroundImage: `url(${getURLPath(props.backgroundUrl)})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover'
	} : {}),
	...(props.backgroundColor ? {
		backgroundColor: props.backgroundColor,
	} : {})
}))
</script>


<template>
<div class="layout-centered" :style="stylesDynamics">
	<slot/>
</div>
</template>


<style lang="scss">
.layout-centered {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

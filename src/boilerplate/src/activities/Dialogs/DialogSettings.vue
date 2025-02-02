<script setup lang="ts">
/* eslint-disable no-unused-vars */

import { ActivitySettings} from "@app-organizer";

const props = defineProps({
	onTerminate: {
		type: Function,
	},
	onCancel: {
		type: Function,
	},
});

const onClickConfirm = () => {
	// emit('onTerminate')
	if (props.onTerminate) props.onTerminate();
};

const onClickCancel = () => {
	// emit('onCancel')
	if (props.onCancel) props.onCancel();
};
</script>

<template>
<div class="dialog-settings-ctn">
	<ActivitySettings :from-dialog="true" :onCancel="onCancel" :onTerminate="onTerminate"/>
</div>
</template>

<style lang="scss">
.dialog-settings-ctn {
	display: flex;
	flex: 1;
}
</style>

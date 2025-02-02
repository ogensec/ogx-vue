<script setup lang="ts">
/* eslint-disable no-unused-vars */
import { ref, watch, computed, onMounted, nextTick, shallowRef, markRaw } from 'vue';
import { NAMESPACE } from './events';
import useEventEmitter from '@ogen-composables/useEventEmitterBrowser.ts';

const defaultDialogParams = {
	options: {
		maxWidth: 800,
		fullscreen: false,
		persistent: false,
	},
};

const props = defineProps({
	controller: {
		type: Object,
		required: true,
	},
	item: {
		type: Object,
		required: true,
	},
});

const Emitter = useEventEmitter(NAMESPACE);

const currentItem = shallowRef(props.item);
const isDialogOpen = ref(true);
const isProcessed = ref(false);

const dialogs = ref([]);

watch(
	() => props.item,
	next => {
		isProcessed.value = false;
		if (!next) {
			isDialogOpen.value = false;
			prepareItem(null);
			return;
		}
		isDialogOpen.value = true;
		prepareItem(props.item);
	},
);

watch(isDialogOpen, next => {
	isProcessed.value = false;
	if (!next) {
		dialogs.value.shift();
	}
});

const prepareItem = item => {
	if (!item) currentItem.value = null;
	currentItem.value = item;
};

function onCancelDialog(...args) {
	setTimeout(() => {
		props.controller.cancel({ dialogId: currentItem.value.id }, ...args);
	}, 0);
}

function onTerminateDialog(...args) {
	setTimeout(() => {
		props.controller.terminate({ dialogId: currentItem.value.id }, ...args);
	}, 0);
}

function onCloseDialog() {
	if (!isProcessed.value && !currentItem.value.options.persistent) {
		onCancelDialog();
	}
}

const itemProps = computed(() => {
	const { onTerminate, onCancel, ...rest } = currentItem.value.props;
	return rest;
});

const currentItemComponent = computed(() => currentItem.value.component)

onMounted(() => {
	prepareItem(props.item);
});
</script>


<template>
<div v-if="isDialogOpen" 
     class="custom-dialog-overlay" 
     @click.self="onCloseDialog"
     :class="[{ displayed: !currentItem.options.hideOverlay }, currentItem.extraClassOverlay]"
     :style="{ '--dg-overlay-color': currentItem.options.colorOverlay || 'rgba(0,0,0, 0.2)'}"
>
	<div class="custom-dialog" :style="{ ...currentItem.options.style  }"
	     :class="[currentItem.extraClass, currentItem.id]">
		<component
			:is="currentItemComponent"
			v-bind="itemProps"
			:on-terminate="onTerminateDialog"
			:on-cancel="onCancelDialog"
		/>
	</div>
</div>
</template>

<style lang="scss">
.custom-dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 90;

	&.displayed {
		background-color: var(--dg-overlay-color);
	}
}

.custom-dialog {
	border-radius: 8px;
	padding: 20px;
	display: inline-flex;
}
</style>

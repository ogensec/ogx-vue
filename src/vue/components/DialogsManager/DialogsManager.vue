<script setup lang="ts">
/* eslint-disable no-unused-vars */
import { ref, computed, watch, onMounted, onUnmounted, getCurrentInstance, shallowRef } from 'vue';
import { NAMESPACE, DIALOG_PUSH, DIALOG_REMOVE } from './events';
import StaticDialog from './StaticDialog.vue';

import useEventEmitter from '@ogen-composables/useEventEmitterBrowser';
import { nextConsole } from '@ogen-composables/helpers/useDevTools';
const console = nextConsole('DialogsManager', { color: 'white', backgroundColor: '#687dfa' });
/**
 * Dialog options :
 * {
 *     type: undefined | ['warn', 'boolean']
 *     component: VueComponent
 *     props: any
 *     options: {
 *       maxWidth: 800,
 *       fullscreen: false,
 *       persistent: false,
 *       classAppear: string,
 *       classDisappear: string
 *       classOverlayAppear
 *       classOverlayDisappear
 * 
 *     }
 *
 * }
 * @type {unknown}
 */
/* Example : copy & paste & edit

import { Events as DialogsEvents } from '@components-local/DialogsManager';
const DialogsEmitter = useEventEmitter(DialogsEvents.NAMESPACE);

    DialogsEmitter.$emit(DialogsEvents.DIALOG_PUSH, {
        id: 'img-' + value + Date.now(),
        component: DialogImagePreview,
        options: {
          attachTo: '.userchannels-chat',
          width: 'unset',
          fullscreen: false,
          persistent: true,
          hideOverlay: false,
          classAppear: string,
          classDisappear: string
          classOverlayAppear: string
		  classOverlayDisappear: string
        },
        props: {
            imagePath: value,
            // onCancel: () => {},
            // onTerminate: () => {},
        },
    });
 */

const defaultDialogParams = {
    options: {
        style: {
			maxWidth: '80%',	
        },
        fullscreen: false,
        persistent: true,
    },
};

const refSelf = getCurrentInstance().proxy.$;

const Emitter = useEventEmitter(NAMESPACE);

const refStaticDialog = ref(null);
const isDialogOpen = ref(false);
const isAppearing = ref(true);

const dialogs = shallowRef([]);

const currentDialog = computed(() => {
    if (dialogs.value.length) {
        return { 
			...dialogs.value[0],
	        extraClass: isAppearing.value ? dialogs.value[0].options.classAppear : dialogs.value[0].options.classDisappear ,
	        extraClassOverlay: isAppearing.value ? dialogs.value[0].options.classOverlayAppear : dialogs.value[0].options.classOverlayDisappear ,
	        isAppearing: isAppearing.value
        }
    }
    return null;
});

// watch(isDialogOpen, next => {
//   console.log('isDialogOpen', next);
//   if (!next) {
//     dialogs.value.shift()
//   }
// });
//
watch(currentDialog, next => {
    if (!next) {
        isDialogOpen.value = false;
    } else {
        isDialogOpen.value = true;
    }
});

watch(
    dialogs,
    next => {
        isDialogOpen.value = !!next.length;
    },
    { deep: true },
);

const pushDialog = dialogBuilder => {
    if (!dialogBuilder.type && !dialogBuilder.component) {
        console.error('Missing dialog.type || dialog.component');
    } else if (!dialogBuilder.id) {
        console.error('Missing dialog.id');
    }
    dialogBuilder.options = {
        ...defaultDialogParams.options,
        ...(dialogBuilder.options || {}),
    };

    dialogs.value = [dialogBuilder, ...dialogs.value];
    isDialogOpen.value = true;

    console.log('Pushed dialog :', dialogBuilder);
    console.log('Dialogs:', dialogs.value);
};

const terminate = ({ dialogId }, ...args) => {
  console.log('> terminate', dialogId);

	isAppearing.value = false;
	setTimeout(() => {

  const dialog = dialogs.value.find(d => d.id === dialogId);
    if (dialog) {
        if (dialog?.props?.onTerminate) dialog?.props?.onTerminate(...args);
    }
    dialogs.value = dialogs.value.filter(dialog => dialog.id !== dialogId);
		isAppearing.value = true;
	}, currentDialog.value.options.timeAnimation || 350)
};

const cancel = ({ dialogId }, ...args) => {
  console.log('> cancel',dialogId);
  
  isAppearing.value = false;
  setTimeout(() => {
	  const dialog = dialogs.value.find(d => d.id === dialogId);
	  if (dialog) {
		  if (dialog?.props?.onCancel) dialog?.props?.onCancel(...args);
	  }
	  dialogs.value = dialogs.value.filter(dialog => dialog.id !== dialogId);
	  isAppearing.value = true;
  }, currentDialog.value.options.timeAnimation || 350)

};

const removeDialog = ({ dialogId }) => {
    console.log('Removed dialog :', dialogId);
    dialogs.value = dialogs.value.filter(e => e.id !== dialogId);
};

onMounted(() => {
    Emitter.$on(DIALOG_PUSH, pushDialog);
    Emitter.$on(DIALOG_REMOVE, removeDialog);
});

onUnmounted(() => {
    Emitter.$on(DIALOG_PUSH, pushDialog);
    Emitter.$on(DIALOG_REMOVE, removeDialog);
});

defineExpose({
    terminate,
    cancel,
});
</script>

<template>
    <!-- For alone dialog animation -->
    <StaticDialog v-if="isDialogOpen" ref="refStaticDialog" :controller="refSelf.exposed" :item="currentDialog" />
    <!-- For multiple dialog animation -->
    <!--      <div>-->
    <!--        <StaticDialog  v-for="(dialog, index) in dialogs" :key='dialog.id' v-show="index === 0" ref="refStaticDialog" :controller="self" :item="dialog" />-->
    <!--      </div>-->
</template>

<style lang="scss">

</style>

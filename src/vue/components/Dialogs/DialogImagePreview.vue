<script setup lang="ts">
/* eslint-disable no-unused-vars */
import {  defineEmits, computed } from 'vue';

const emit = defineEmits(['onTerminate', 'onCancel']);

const props = defineProps({
    onCancel: {
        type: Function,
    },
    imagePath: {
        type: String,
        required: true,
    },
    attachTo: {
        type: String,
    },
});

const cancel = () => {
    props.onCancel();
};

const isOpen = computed(() => {
    return props.imagePath != null;
});
</script>
<template>
    <div class="dialog-imageviewer wrapper">
        <img class="popup" v-if="imagePath" :src="imagePath" style="" />
        <v-btn
            x-small
            depressed
            color="red"
            dark
            fab
            @click="() => cancel()"
            style="position: absolute; height: 26px; width: 26px; top: 5px; right: 5px"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
    </div>
</template>

<style lang="scss">
.dialog-imageviewer {
    display: flex;
    &.wrapper {
        max-height: 100%;
        max-width: 100%;
        width: fit-content;
        height: fit-content;
        position: relative !important;
        overflow: hidden !important;
        .popup {
            object-fit: contain;
            max-height: 100%;
            max-width: 100%;
        }
    }

    .v-dialog__content {
        margin-left: 64px !important;
        width: calc(100% - 64px) !important;
        margin-top: 48px;
        height: calc(100% - 78px);
        overflow: hidden !important;
    }
    .v-dialog__content--active {
        background-color: rgba(0, 0, 0, 0.603);
    }
    .v-dialog--active {
        overflow: hidden !important;
        margin: 10px;
    }
}
</style>

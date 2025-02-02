<template>
  <v-alert
    :title="message.title"
    :text="message.text"
    :type="message.type"
    :closable="message.closable"
    :variant="variant"
    :rounded="rounded"
    :border="border"
    :elevation="elevation"
    :density="density"
    class="notification"
    @click:close="$emit('close')"
  />
</template>

<style scoped>
.toast {
  z-index: 1;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}
</style>

<script setup lang="ts">
import type { ToastMessage } from '@/plugins/toast'
import { useTimeoutFn } from '@vueuse/core'
import type { VAlert } from 'vuetify/components'

const {
  message: { duration }
} = defineProps<{
  message: ToastMessage
  variant?: VAlert['$props']['variant']
  rounded?: VAlert['$props']['rounded']
  border?: VAlert['$props']['border']
  elevation?: VAlert['$props']['elevation']
  density?: VAlert['$props']['density']
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

useTimeoutFn(() => emit('close'), duration)
</script>

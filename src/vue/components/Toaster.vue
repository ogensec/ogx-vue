<template>
  <div class="container">
    <v-scroll-y-transition group>
      <toast-message
        :key="message.id"
        v-for="message in messages"
        @close="onRemove(message)"
        :message="message"
        position="relative"
        :variant="variant"
        :rounded="rounded"
        :border="border"
        :elevation="elevation"
        :density="density"
      />
    </v-scroll-y-transition>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 420px;
}
</style>

<script setup lang="ts">
import { ToastSymbol, type ToastMessage } from '@/plugins/toast'
import { useEventBus } from '@vueuse/core'
import { ref } from 'vue'
import type { VAlert } from 'vuetify/components'

const bus = useEventBus<ToastMessage>(ToastSymbol)

type Message = ToastMessage & { id: number }

const messages = ref<Message[]>([])

defineProps<{
  variant?: VAlert['$props']['variant']
  rounded?: VAlert['$props']['rounded']
  border?: VAlert['$props']['border']
  elevation?: VAlert['$props']['elevation']
  density?: VAlert['$props']['density']
}>()

// Disable attribute inheritance
defineOptions({
  inheritAttrs: false
})

const onRemove = (message: Message) => {
  const index = messages.value.findIndex(({ id }) => id === message.id)

  if (index !== -1) {
    messages.value.splice(index, 1)
  }
}

bus.on((message: ToastMessage) => {
  messages.value.push({
    id: Date.now(),
    ...message
  })
})
</script>

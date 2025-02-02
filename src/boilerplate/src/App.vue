<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import { useThemes, useTranslations, useGraphicModes } from '@ogen-providers/app/composables'
import LoadingView from '@components/Loader.vue'
import DialogsManager from '@ogen-components/DialogsManager/DialogsManager.vue'

const Controller = defineAsyncComponent(() => import('@components/Controller.vue'))

const { PRINT, InjectLocalesMessages } = useTranslations()
const { current: currentTheme } = useThemes()
const { currentName: currentGraphicName } = useGraphicModes()

InjectLocalesMessages({
  fr: {
    loading_env: 'Chargement...'
  },
  en: {
    loading_env: 'Loading...'
  }
})

const computedClass = computed(() => {
  return [currentTheme.value, currentGraphicName.value]
})

</script>
<template>
  <Suspense>
    <div id="app-container" :class="computedClass">
      <DialogsManager />
      <Controller />
    </div>

    <template #fallback>
      <LoadingView
        class="d-flex justify-center align-center flex-column w-100 h-100 fadeIn"
        :message="PRINT('loading_env')"
      />
    </template>
  </Suspense>
</template>

<style lang="scss">
#app {
  #app-container {
    flex: 1;
    display: flex;
    background-color: var(--background-base);
    height: 100%;
    width: 100%;
  }
}
</style>

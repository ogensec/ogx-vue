<script setup lang="ts">
import { computed } from "vue";

type TPropsLogoMain = {
  maxWidth?: string,
  alt ?: string,
}

const props = withDefaults(defineProps<TPropsLogoMain>(), {
  maxWidth: '60px',
  alt: 'ogen-logo'
});

const computedStyle = computed(() => ({
  maxWidth: props.maxWidth,
}))

</script>

<template>
  <img src="@ogen-assets/images/ogen.png"
       :alt="props.alt"
       :style="computedStyle"
  />
</template>

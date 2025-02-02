<script setup lang="ts">
import { defineAsyncComponent, ref, watch, onMounted, shallowRef, computed } from 'vue'
import { reactives as AppReactives } from "@ogen-providers/app/memory";


const layoutName = ref('default');
const components: { [key: string]: any } = {}
const layoutProps = shallowRef<{}>({ });

const layoutComponent = computed(() => {
  return components[layoutName.value];
})
const loadLayout = async (layout: any) => {
  try {

    if (!components[layout.name as string]) {
      components[layout.name as string] = defineAsyncComponent(() =>
        import(`@layouts/${layout.name}.vue`)
      );
    }

    layoutProps.value = { ...layout.props };
    layoutName.value = layout.name
  } catch (error) {

    loadLayout({
      name: 'default',
      props: {},
    }).finally()
  }
};

watch(
  () => AppReactives.layout,
  async (nextLayout) => {
    if (nextLayout) {
      await loadLayout(nextLayout);
    }
  },
  { deep: false, immediate: true }
);

onMounted(async () => {
  if (AppReactives.layout) {
    await loadLayout(AppReactives.layout);
  }
});
</script>

<template>
  <component :is="layoutComponent" v-bind="layoutProps" :key="layoutName">
    <slot />
  </component>
</template>

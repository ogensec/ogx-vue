<script lang="ts" setup>
import { initModule } from './actions';
import { useRouter, useTranslations, useThemes } from "@ogen-providers/app/composables";


export type T{{EntityName}}Props = {
	myProps: any
}

const props = withDefaults(defineProps<T{{EntityName}}Props>(), {
  myProps: 'defaultValue',
})

const { router, route } = useRouter();
const { current: currentTheme, set: setTheme } = useThemes();
const { InjectLocalesMessages, current: currentLanguages, set: setLanguages } = useTranslations();

InjectLocalesMessages({
  fr: {
    my_index: "Bonjour, c'est mon index",
  },
  en: {
    my_index: "Hello, it's my index",
  }
})

initModule();

</script>


<template>
<div class="activity-{{EntityNameLowercase}}">
    I am home
</div>
</template>

<style>
@import 'styles.scss';
</style>

<style lang="scss">
.activity-{{EntityNameLowercase}} {
  color: var(--text-base);
}
</style>

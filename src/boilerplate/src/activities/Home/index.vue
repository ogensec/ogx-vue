<script lang="ts" setup>
import { useRouter } from "@ogen-providers/app/composables";

const { route } = useRouter();

export type TDesign = {
	logo: any
	colorMain: string;
}

</script>


<template>
<div class="activity-home">
    I am home
</div>
</template>

<style>
@import 'styles.scss';
</style>

<style lang="scss">
.activity-home {
  color: var(--text-base);
}
</style>

<script setup lang="ts">

import { useRouter } from "@ogen-providers/app/composables"

const router = useRouter();

const errorId = router?.currentRoute?.value?.params?.id || 404


</script>

<template>
	  <Suspense>
		  <div class="error-nb">{{errorId}}</div>
	  </Suspense>
</template>

<style lang="scss">
.view-error {
  .error-nb {
    font-size: 30px;
    color: white;
  }
}</style>

import { computed } from 'vue';
import { useModule } from '@ogen-providers/app/composables'
import type { I{{EntityName}}Module } from '@modules/{{EntityName}}/{{EntityNameLowercase}}.module.ts'
import {{EntityName}}Module from '@modules/{{EntityName}}/{{EntityNameLowercase}}.module.ts'

export const moduleData = computed(() => {
  const {{EntityName}} = useModule<I{{EntityName}}Module>({{EntityName}}Module.NAMESPACE) as I{{EntityName}}Module;
  return {{EntityName}}.myComputed;
})


export default () => {
  return {
    moduleData,
  }
}
import { computed } from 'vue';
import { useModule } from '@ogen-providers/app/composables'
import type { IAutorizerModule } from '@modules/authorizer/authorizer.module.ts'
import AutorizerModule from '@modules/authorizer/authorizer.module.ts'

export const clientData = computed(() => {
  const Autorizer = useModule<IAutorizerModule>(AutorizerModule.NAMESPACE) as IAutorizerModule;
  return Autorizer.userData;
})


export default () => {
  return {
    clientData,
  }
}
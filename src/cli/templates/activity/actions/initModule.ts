import { onMounted, onUnmounted } from 'vue';
import { actionConsole as console } from '../composable'
import { enable as enableListeners, disable as disableListeners } from '../listeners';

export default async function initModule() {

  console.log('initModule');

  try {

    onMounted(async () => {
      enableListeners();
    })

    onUnmounted(() => {
      disableListeners()
    })

  } catch (e: any) {

    console.error(e);
    return { errors: e.message }
  }
}
import { computed, watch } from 'vue';

import { useRoute } from 'vue-router';
import router from '@app-router';

export default () => {

	const route = useRoute();

	return { router, route }
}
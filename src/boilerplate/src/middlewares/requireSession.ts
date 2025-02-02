import { watch } from 'vue';
import {
	ROUTE_AUTH
} from '@app-routes';
import { ram } from "@ogen-providers/app/memory";
import { useModule, useRouter } from '@ogen-providers/app/composables';
import AutorizerModule from "@modules/authorizer/authorizer.module";


export default async function () {
	
	const Authorizer = useModule<AutorizerModule>(AutorizerModule.NAMESPACE) as AutorizerModule
	
	if (!Authorizer.hasCurrentSession) {
		const { route } = useRouter();
		ram.redirect.value = route.fullPath
		return { name: ROUTE_AUTH.name }
	}

	return false;

}
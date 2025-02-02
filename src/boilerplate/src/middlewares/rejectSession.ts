
import {
	ROUTE_HOME
} from '@app-routes';
import AutorizerModule from "@modules/authorizer/authorizer.module";
import { useModule } from "@ogen-providers/app/composables";

export default async function () {

	const Authorizer = useModule<AutorizerModule>(AutorizerModule.NAMESPACE);

	if (Authorizer.hasCurrentSession) {
		return { name: ROUTE_HOME.name }
	}

	// watch(() => Authorizer.hasCurrentSession, (value) => {
	// 	if (value) router.push({ name: ROUTE_HOME.name }).finally()
	// })

	return false;

}
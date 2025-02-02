import { actionConsole as console } from '../composable'
import { useClient } from '@app-axios'
import { useModule } from "@ogen-providers/app/composables"
import type { IAutorizerModule } from '@modules/authorizer/authorizer.module.ts'
import AutorizerModule from '@modules/authorizer/authorizer.module.ts'

export default async function getClientData() {
	console.log('getClientData');

	try {

		const Autorizer = useModule<IAutorizerModule>(AutorizerModule.NAMESPACE) as IAutorizerModule;

		
	} catch (e: any) {

		console.error(e);
		return { errors: e.message }
	}
}
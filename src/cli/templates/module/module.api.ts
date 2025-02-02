import { DefaultInstance } from "@app-axios";
import { isString, isBoolean } from '@ogen-composables/helpers/useValidators'
import { createEndpoint } from '@ogen-providers/app/composables/useApi';

const PATH_API =  '/api'

export const POST_PING = createEndpoint(
	{
		api: DefaultInstance,
		method: 'POST',
		path: `${PATH_API}/ping`,
		body: {
			identifier: {
				validators: [isString],
			}
		}
	},
	{
		exist: [isBoolean],
	}
);

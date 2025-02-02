// import { DefaultInstance } from "@app-axios";
// import { isString, isNumber, isBoolean, isAny } from '@ogen-composables/helpers/useValidators'
// import { createEndpoint } from '@ogen-providers/app/composables/useApi';
//
// const PATH_AUTH =  '/auth'
//
// export const POST_IDENTIFIER_EXISTS = createEndpoint(
// 	{
// 		api: DefaultInstance,
// 		method: 'POST',
// 		path: `${PATH_AUTH}/identifier/exists`,
// 		body: {
// 			identifier: {
// 				validators: [isString],
// 			}
// 		}
// 	},
// 	{
// 		exist: [isBoolean],
// 		payload: [isString]
// 	}
// );
//
// export const POST_LOGIN_CHECK = createEndpoint(
// 	{
// 		api: DefaultInstance,
// 		method: 'POST',
// 		path: `${PATH_AUTH}/login-check`,
// 		body: {
// 			payload: {
// 				validators: [isString],
// 				required: true,
// 			},
// 			password: {
// 				validators: [isString],
// 				required: true,
// 			},
// 			device: {
// 				validators: [isAny],
// 			}
// 		}
// 	},
// 	{
// 		success: [isBoolean],
// 	}
// );
//
// export const POST_REGISTRATION_REQUEST = createEndpoint(
// 	{
// 		api: DefaultInstance,
// 		method: 'POST',
// 		path: `${PATH_AUTH}/registration/request`,
// 		body: {
// 			name: {
// 				validators: [isString]
// 			},
// 			firstname: {
// 				validators: [isString]
// 			},
// 			birth_day: {
// 				validators: [isNumber]
// 			},
// 			birth_month: {
// 				validators: [isNumber]
// 			},
// 			birth_year: {
// 				validators: [isNumber]
// 			},
// 			genre: {
// 				validators: [isString]
// 			},
// 			password: {
// 				validators: [isString],
// 			}
// 		}
// 	},
// 	{
// 		success: [isBoolean],
// 		payload: [isString]
// 	}
// );
//
// export const POST_REGISTRATION_CONFIRM = createEndpoint(
// 	{
// 		api: DefaultInstance,
// 		method: 'POST',
// 		path: `${PATH_AUTH}/registration/confirm`,
// 		body: {
// 			code: {
// 				validators: [isString]
// 			},
// 			payload: {
// 				validators: [isString]
// 			},
// 			device: {
// 				validators: [isAny]
// 			}
// 		}
// 	},
// 	{
// 		success: [isBoolean],
// 		token: [isString]
// 	}
// );
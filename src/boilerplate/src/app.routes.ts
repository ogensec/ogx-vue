
import rejectSession from "@middlewares/rejectSession";
import requireSession from "@middlewares/requireSession";
import type { RouteRecordRaw } from 'vue-router'


/** Routes list **/


export const ROUTE_AUTH = {
	path: '/auth', name: 'Auth',
	component: () => import('@activities/Auth/index.vue'),
	meta: {
		middlewares: [rejectSession],
		layout: 'centered',
		tags: {
			title: 'OGEN - Auth',
			meta: {
				description: 'OGEN Authentification',
			}
		},
	}
}

export const ROUTE_AUTH_CALLBACK = {
	path: '/auth/callback', name: 'AuthCallback',
	component: () => import('@activities/Auth/index.vue'),
	meta: {
		tags: {
			title: 'OGEN - redirection...',
			meta: {
				description: 'OGEN Authentification',
			}
		},
	}
}

export const ROUTE_HOME = {
	path: '/', name: 'Home',
	component: () => import('@activities/Home/index.vue'),
	meta: {
		middlewares: [requireSession],
		layout: 'dashboard',
		tags: {
			title: 'OGEN - Home',
			meta: {
				description: 'OGEN Home',
			}
		},
	}
}

export const ROUTE_ERROR = {
	path: '/e/:id', name: 'Error',
	component: () => import('@activities/Errors/index.vue'),
	meta: {
		layout: 'centered',
		tags: {
			title: 'OGEN - ERRORS'
		},
	}
}

/** Router utils methods **/

// const components = new Map();


//
//
// function asyncRouteComponent(importer: any, params = {}) {
//
// 	if (!components.get(importer.toString())) {
// 		components.set(importer.toString(), () => Promise.resolve({
// 				render() {
// 					const async_component = defineAsyncComponent({
// 						loader: importer,
// 						loadingComponent: DefaultLoader,
// 						...params
// 					})
// 					return h(async_component)
// 				}
// 			})
// 			)
//
// 	}
// 	return components.get(importer.toString());
// }
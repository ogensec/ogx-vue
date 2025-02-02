import { defineAsyncComponent } from "vue";
import { defineAsyncComponentWithLoader } from "@ogen-core";
/******************************************
 * All components must be declared here   *
/*****************************************/


/************************************************
# APP Mains
 ************************************************/
export { default as DefaultLoader } from "@ogen-components/spinners/Spinner8balls.vue";
import Loader from "@components/Loader.vue";

const DefaultFormLoader = {
	component: Loader,
	props: {
		loaderSize: 3,
		colorLoader: 'var(--text-base)',
		loaderStyle: { padding: '5px' },
		style: {
			display: 'flex',
			justifyContent: 'center',
			padding: '20px 0 0 0'
		}
	}
}

const DefaultViewLoader = {
	component: Loader,
	props: {
		loaderSize: 6,
		colorLoader: 'var(--text-base)',
		loaderStyle: { padding: '5px' },
		style: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexGrow: '1',
		}
	}
}


// export const Controller = defineAsyncComponent(() =>
//   import("@/components/Controller/Controller.vue")
// );

/************************************************
# Layouts list
 ************************************************/

// export const LayoutResizable = defineAsyncComponent(() =>
// 	import("@layouts/LayoutResizable.vue")
// );
/************************************************
# Activities list (Entrypoints)
 ************************************************/
export const ActivityAuth = defineAsyncComponent(() => import("@activities/Auth/index.vue"));
export const ActivitySettings = defineAsyncComponentWithLoader(() => import("@activities/Settings/index.vue"), DefaultViewLoader)
export const SettingsAccountPersInformations = defineAsyncComponentWithLoader(() => import("@activities/Settings/SettingsAccount/SettingsAccountPersInformations.vue"), DefaultViewLoader)
export const SettingsAccessibilityGraphics = defineAsyncComponentWithLoader(() => import("@activities/Settings/SettingsAccessibility/SettingsAccessibilityGraphics.vue"), DefaultViewLoader)
export const SettingsAccessibilityLanguages = defineAsyncComponentWithLoader(() => import("@activities/Settings/SettingsAccessibility/SettingsAccessibilityLanguages.vue"), DefaultViewLoader)
/************************************************
 # Components
 ************************************************/

export const BaseButton = defineAsyncComponent(() => import("@ogen-components/BaseButton.vue"));
export const BaseButtonIcon = defineAsyncComponent(() => import("@ogen-components/BaseButtonIcon.vue"));

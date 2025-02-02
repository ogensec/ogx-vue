// Namespace
export const NAMESPACE = 'provider:app';

// Constants
export const SETTINGS = {
	AUTOSTART: 'app:autostart',
	SHOW_INFOBAR: 'app:infobar',
	GRAPHIC: {
		LANGUAGE: 'set:graphic:language',
		THEME: 'set:graphic:theme',
		GRAPHIC: 'set:graphic:level',
	},
};


export const bootstrap = () => {

	//Enable default emitter
	// enableEventsListener();

	//Link global errors exception to action
	// window.addEventListener('error', function (event) {
	//     catchErrorAction(LOGGER_ERRORS_TYPE.EXCEPTION, event);
	// });
	//
	// //Link global errors from unhandled rejected promise to action
	// window.addEventListener('unhandledrejection', function (event) {
	//     catchErrorAction(LOGGER_ERRORS_TYPE.EXCEPTION, event);
	//     // event.preventDefault();
	// });

};

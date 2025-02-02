import { actionConsole as console } from '../composable'
import useEventEmitterBrowser from "@ogen-composables/useEventEmitterBrowser";
import { Events as DialogsManagerEvents} from "@components-shared/DialogsManager/"
import DialogSettings from "@activities/Dialogs/DialogSettings.vue"

export default async function openDialogSettings() {
	
	try {
		const DialogsEmitter = useEventEmitterBrowser(DialogsManagerEvents.NAMESPACE);

		return new Promise(resolve => {
			DialogsEmitter.$emit(DialogsManagerEvents.DIALOG_PUSH, {
				id: 'dialog-settings',
				component: DialogSettings,
				options: {
					fullscreen: false,
					persistent: false,
					hideOverlay: false,
					classAppear: 'fadeIn d-1 a-8',
					classDisappear: 'fadeOutDown a-4',
					classOverlayAppear: 'fadeInDown a-4',
					classOverlayDisappear: 'fadeOutUp a-4',
					colorOverlay: 'var(--background-overlay)',
					timeAnimation: 150,
					style: {
						minWidth: '70%',
						minHeight: '70%',
						maxWidth: '95%',
						maxHeight: '95%',

					}
				},
				props: {
					text: 'Hey I am dialog',
					onTerminate: () => {
						resolve(true);
					},
					onCancel: () => {
						resolve(true);
					}
				},

			})
		})
	}
	catch(e) {
		console.error(e);
		return false;
	}

}
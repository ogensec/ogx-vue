import { actionConsole as console } from '../composable'


type TMyProvidedActionArgs = {

}

export default async function myProvidedAction(args: TMyProvidedActionArgs) {
	console.log('myProvidedAction');

	try {

		
	} catch (e: any) {

		console.error(e);
		return { errors: e.message }
	}
}
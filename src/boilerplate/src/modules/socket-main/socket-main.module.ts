import { SocketCore } from "@ogen-core";
import { nextConsole } from '@ogen-composables/helpers/useDevTools';


let console = nextConsole('Module[Socket:MAIN]', { color: '#FFFFFF', background: '#24035b' })


export default class SocketMain extends SocketCore {
	
	public static NAMESPACE = 'socket:main';

	public static events = {
		UPDATE_STATES: 'update:states'
	};

	constructor({ host }:{ host: string }) {
		super({ id: SocketMain.NAMESPACE, host })
	}
	
}
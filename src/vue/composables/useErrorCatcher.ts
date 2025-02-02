import type { Ref } from 'vue';
import { nextConsole } from '@ogen-composables/helpers/useDevTools';

// Configuration type
type ConfigType = {
	showException: boolean;
	showExceptionLocation: boolean;
	showExceptionClient: boolean;
	showExceptionStack: boolean;
	throwException: boolean;
};

const CONFIG: ConfigType = {
	showException: true,
	showExceptionLocation: true,
	showExceptionClient: true,
	showExceptionStack: true,
	throwException: true,
};


const console = nextConsole('useSocketSubscriber', {
	color: '#ffffff',
	backgroundColor: '#0b2099',
});

// Utility type for error stacks and files
type ErrorStackType = string[];
type LocationType = {
	origin: string;
	path: string;
	port: string;
	protocol: string;
};
type NavigatorInfoType = {
	userAgent: string;
	bluetooth: any; // Bluetooth type is complex, using `any` for simplicity
	connection: any; // NetworkInformation type, using `any`
	language: string;
};

export default {
	/**
	 * Catch and display Error
	 */
	catch(Error: Error): void {
		if (CONFIG.showException) {
			console.log(Error.toString());
			const stack = this._getCallerFiles(Error.stack);
			const location = this._getErrorRouteLocation();
			const client = this._getClientNavigator();

			console.log("From file ►", stack[0]);
			if (CONFIG.showExceptionLocation) console.log("From location ►", location);
			if (CONFIG.showExceptionClient) console.log("From client ►", client);
			if (CONFIG.showExceptionStack) console.log('Stack  ►', stack);
			if (CONFIG.throwException) throw Error;
		}
	},

	/**
	 * Organize error stack files
	 */
	_getCallerFiles(errorStack: string | undefined): ErrorStackType {
		const files: ErrorStackType = [];
		const lines = errorStack ? errorStack.toString().split(' at ') : [];
		const regExp = /\(([^)]+)\)/;

		for (const line of lines) {
			const matches = regExp.exec(line);
			if (matches && matches[0]) {
				let file: any = matches[0].split('/');
				file = file[file.length - 1];
				file = file.replace(')', '');
				files.push(file);
			}
		}

		return files.filter((e) => e !== null);
	},

	/**
	 * Get error route location
	 */
	_getErrorRouteLocation(): LocationType {
		return {
			origin: window.location.origin,
			path: window.location.pathname,
			port: window.location.port,
			protocol: window.location.protocol,
		};
	},

	/**
	 * Get client navigator
	 */
	_getClientNavigator(): NavigatorInfoType {
		const {
			userAgent,
			bluetooth,
			connection,
			language,

		} = window.navigator as Navigator & {
			bluetooth?: any;
			connection?: any;
		};

		return {
			userAgent,
			bluetooth,
			connection,
			language,

		};
	},
};

import type { Ref } from "vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface KeypressOptions {
	[key: string]: string[];
}

interface UseKeypressReturn {
	[key: string]: {
		$on: (callback: () => void) => void;
	}
}

const keyMapper: { [key: string]: string } = {
	'control': 'ctrl',
	'alt': 'alt',
	'shift': 'shift',
	'meta': 'meta'
};

const mapKey = (key: string, location: number): string => {
	const lowerKey = key.toLowerCase();
	if (keyMapper[lowerKey]) {
		if (location === 1) return `${keyMapper[lowerKey]}-left`;
		if (location === 2) return `${keyMapper[lowerKey]}-right`;
	}
	return lowerKey;
};

export default function useKeyPress(keyOptions: KeypressOptions): UseKeypressReturn {
	const keyMap: { [key: string]: boolean } = {};
	const callbacks: { [key: string]: (() => void)[] } = {};
	const states: { [key: string]: Ref<boolean> | UseKeypressReturn } = {};

	const onKeyDown = (event: KeyboardEvent) => {
		const key = mapKey(event.key, event.location);
		keyMap[key] = true;

		for (const [action, keys] of Object.entries(keyOptions)) {
			if (keys.every(k => keyMap[mapKey(k, event.location)])) {
				callbacks[action]?.forEach(callback => callback());
			}

			if (keys.includes(key)) {
				states[action].value = true;
			}
		}
	};

	const onKeyUp = (event: KeyboardEvent) => {
		const key = mapKey(event.key, event.location);
		keyMap[key] = false;

		for (const keys of Object.values(keyOptions)) {
			if (keys.includes(key)) {
				const action = Object.keys(keyOptions).find(a => keyOptions[a].includes(key));
				if (action) {
					states[action].value = false;
				}
			}
		}
	};

	const registerCallback = (action: string, callback: () => void) => {
		if (!callbacks[action]) {
			callbacks[action] = [];
		}
		callbacks[action].push(callback);
	};

	for (const action of Object.keys(keyOptions)) {
		states[action] = ref(false);
		callbacks[action] = [];
	}

	onMounted(() => {
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	});

	const returnObj: UseKeypressReturn = {};
	for (const action of Object.keys(keyOptions)) {
		returnObj[action] = { $on: (callback) => registerCallback(action, callback) };
		returnObj[`isPressing${(action.charAt(0).toUpperCase() + action.slice(1)).replace('OnPress', '')}`] = states[action] as any;
	}

	return returnObj;
}

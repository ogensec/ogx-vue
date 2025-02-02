import { ref, watch } from 'vue';

type StorageObject = string | number | boolean | Record<string, any>;

export default function useLocalStorage<T extends StorageObject>(
	key: string,
	initialValue: T
) {
	const local = localStorage.getItem(key);

	const storedValue = ref(
		local
			? (typeof initialValue === 'object' ? JSON.parse(local) : local) as T
			: initialValue
	);

	if (!local && initialValue !== undefined) {
		storedValue.value = initialValue;
		localStorage.setItem(
			key,
			typeof initialValue === 'object' ? JSON.stringify(initialValue) : String(initialValue)
		);
	}

	watch(
		storedValue,
		(newValue) => {
			if (newValue !== null) {
				localStorage.setItem(
					key,
					typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue)
				);
			} else {
				localStorage.removeItem(key);
			}
		},
		{ deep: true }
	);

	return storedValue;
}

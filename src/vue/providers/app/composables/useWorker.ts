//@ts-nocheck
import AppWorkers from '@app-workers';
import useEventEmitterBrowser from '@ogen-composables/useEventEmitterBrowser'

const RAM_WORKERS: any = {}

const MESSAGE_TYPES = {
	CALLBACK: 'callback',
	PIPE: 'pipe',
}
export default function useWorker<K extends keyof typeof AppWorkers>(workerName: K): any {
	try {
		if (RAM_WORKERS[workerName]) return RAM_WORKERS[workerName];

		const targetWorker = AppWorkers[workerName as keyof typeof AppWorkers];
		if (!targetWorker) {
			console.error(`Worker ${ workerName } not found in app.workers file`);
			return
		}

		const WorkerEvents = useEventEmitterBrowser(`worker-${ workerName }`);


		const CustomWorker = {
			worker: targetWorker(),
			events: WorkerEvents,
		}
		
		CustomWorker.exec = ({ cmd, data }): any => {

			return new Promise((resolve: any) => {
				const eventId = randomToken(8);
				console.log('eventId:' + eventId + '::worker -> ' + cmd);
				const response = (data: any) => {
					WorkerEvents.$off(eventId, response);
					resolve(data);

				}
				WorkerEvents.$on(eventId, response)
				CustomWorker.worker.postMessage({ eventId, cmd, data });
			})

		}
		CustomWorker.worker.addEventListener('message', (event: any) => {
			let data: any = event.data;
			let type = data.type || 'pipe'
			if (type === MESSAGE_TYPES.CALLBACK) {
				let eventId = data.eventId !== null ? data.eventId : null;
				let value = data.value !== null ? data.value : null;
				WorkerEvents.$emit(eventId, value);
			} else if (type === MESSAGE_TYPES.PIPE) {
				if (data.event)
					WorkerEvents.$emit(data.event, data.value)
				else {
					console.warn(`Missing event for pipe message in ${ workerName }-worker`)
				}
			}
		});

		RAM_WORKERS[workerName] = CustomWorker;

		return CustomWorker;
	} catch (e) {
		console.error(e);
	}
}

function randomToken(length: number) {
	length = length || 4;
	const char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let charL = char.length, result = '';
	for (let i = 0; i < length; i++) {
		result += char.charAt(Math.floor(Math.random() * charL));
	}
	return result
}
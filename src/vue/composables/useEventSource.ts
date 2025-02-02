import useEventEmitter from "@ogen-composables/useEventEmitterBrowser";;

type TRAM_SOURCES =  Map<string, EventEmitter>

const RAM_SOURCES: TRAM_SOURCES = new Map();

const useEventSource = (namespace: string, source: string) => {

	const exist = RAM_SOURCES.get(namespace);

	if (exist) {
		if (source) console.warn(`Source namespace ${namespace} already exist, no need source.`)
		return exist;
	}
	else {
		const EventEmitter = useEventEmitter('EV:'+namespace);
		const Source = new EventSource(source, { withCredentials: false });

		Source.addEventListener('error', (e) => {
			console.log(e);
		});

		Source.onmessage = (event) => {
			const { events, data } = JSON.parse(event.data);
			for (const event of events) EventEmitter.$emit(event, data);
		};

		RAM_SOURCES.set(namespace, EventEmitter);

		return EventEmitter;
	}
}

export default useEventSource;
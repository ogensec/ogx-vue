class CustomEventEmitter extends EventTarget {

	$on;
	$off;
	$emit
	$once;
	constructor() {
		super();
		this.$on = (eventName: string, listener:any) => {
			const wrappedListener = (event: any) => listener(event.detail);
			this.addEventListener(eventName, wrappedListener);
		};
		this.$off = this.removeEventListener.bind(this);
		this.$emit = (eventName: string, detail: any) => {
			const event = new CustomEvent(eventName, { detail });
			this.dispatchEvent(event);
		};

		this.$once = (eventName:string , listener: any) => {
			const onceListener = (event: any) => {
				listener(event);
				this.removeEventListener(eventName, onceListener);
			};
			this.addEventListener(eventName, onceListener);
		};
	}
}

const RAM_EMITTERS = new Map();

const useEventEmitterBrowser = (namespace: string) => {
	if (!namespace) throw new Error("useEventEmitter : Incorrect NULL namespace");
	const exist = RAM_EMITTERS.get(namespace);
	if (exist) return exist;
	else {
		const emitter = new CustomEventEmitter();
		RAM_EMITTERS.set(namespace, emitter);
		return emitter;
	}
}

export default useEventEmitterBrowser;

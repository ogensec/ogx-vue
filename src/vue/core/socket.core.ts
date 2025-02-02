import { consoleSocket as console } from "./index";
import { ModuleCore } from "@ogen-core";
import useEventEmitter from "@ogen-composables/useEventEmitterBrowser";

export default class SocketCore extends ModuleCore {
    host:string;
    socket: any;

    constructor({ id, host }: { id: string , host: string }) {
        console.log('construct.', host);
        super({ id: id })
        this.id = id;
        this.host = host;
        this.socket = new WebSocket(host);
        
        this.init().finally();
        
    }
    
    async init() {
        const EventEmitterSocket = useEventEmitter(this.id);

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
            // this.isSocketReady = false;
            console.log('WebSocket connection closed');
        };

        this.socket.onmessage = async (event) => {
            try {

                const command = JSON.parse(event.data);

                EventEmitterSocket.$emit(command.event, command.datas);

            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
        
        // setTimeout(() => {
        this.setIsReady(true);
        // },5000)

    }

    async $emit(event, datas) {
        console.log(this.socket);
        this.socket.send(JSON.stringify({event, datas }));
    }
}
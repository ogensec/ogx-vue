/* eslint-disable no-unused-vars */
import useEventEmitter from '@ogen-composables/useEventEmitterBrowser'
import SocketModule from "@modules/socket-main/socket-main.module";
import { NAMESPACE } from './events';

const EventEmitterSocket = useEventEmitter(SocketModule.NAMESPACE);
const {{EntityName}}Emitter = useEventEmitter(NAMESPACE);
/**
 * Module enable listeners
 */
export const enable = () => {
    // EventEmitterSocket.$on(SocketModule.events.UPDATE_STATES, onUpdateStates);
}

/**
 * Module disable  listeners
 */
export const disable = () => {
    // EventEmitterSocket.$off(SocketModule.events.UPDATE_STATES, onUpdateStates)
}

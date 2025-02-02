import { nextConsole } from '@ogen-composables/helpers/useDevTools';
export { createProvider, defineAsyncComponentWithLoader } from './libs';
export { default as MemoryCore } from './memory.core';
export { default as MemoryEntity } from './memory.entity';
export { i18n, loadLanguageAsync, injectLocalesMessages } from './i18n'
export { default as ModuleCore } from './core.module'
export { default as SocketCore } from './socket.core';
export * from './types';

export const consoleSocket =  nextConsole('Core[Socket]', { color: '#FFFFFF', background: '#24035b' })
export const consoleModule =  nextConsole('Core[Module]', { color: '#FFFFFF', background: '#326b04' })
export const consoleMemory =  nextConsole('Core[Memory]', { color: '#FFFFFF', background: '#7c0303' })
// export { default as IPCCacher } from './ipc.cacher.js';              
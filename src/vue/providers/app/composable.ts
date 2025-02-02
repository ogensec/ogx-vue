import { nextConsole } from '@ogen-composables/helpers/useDevTools';

// Default provider composable
export const actionConsole = nextConsole('AppProvider[action]', { color: '#FFFFFF', background: '#7ed87e'})
export const apiConsole = nextConsole('AppProvider[api]', {color: '#22DD68' })
export const memoryConsole = nextConsole('AppProvider[memory]', {color: '#22DD68' })
export const ipcConsole = nextConsole('AppProvider[IPC]', {color: '#22DD68' })
export const eventConsole = nextConsole('AppProvider[Event]', {color: '#22DD68' })
export const socketConsole = nextConsole('AppProvider[Socket]', {color: '#22DD68' })

// Extensions provider automates
// export * as ModuleAutomate from '@ogen-providers/app/automations/modules.automate.js';
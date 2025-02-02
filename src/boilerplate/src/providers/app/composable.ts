import { nextConsole } from '@ogen-composables/helpers/useDevTools';

// Default provider dev-utils composable
export const actionConsole = nextConsole('AppProvider[action]', { color: '#FFFFFF', background: '#7ed87e'})
export const apiConsole = nextConsole('AppProvider[api]', {color: '#22DD68' })
export const memoryConsole = nextConsole('AppProvider[memory]', {color: '#22DD68' })
export const ipcConsole = nextConsole('AppProvider[IPC]', {color: '#22DD68' })
export const eventConsole = nextConsole('AppProvider[Event]', {color: '#22DD68' })
export const socketConsole = nextConsole('AppProvider[Socket]', {color: '#22DD68' })

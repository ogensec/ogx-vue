import { createProvider } from '@ogen-core';
import type { TAppProvider } from "./app.types";

export const useAppProvider = ()  => createProvider<TAppProvider>(
	'app',
	{
		setup: async() => (await import('@ogen-providers/app/setup')),
		actions: async () => (await import('@ogen-providers/app/actions')),
		api: async () => (await import('@ogen-providers/app/api')),
		memory: async () => (await import('@ogen-providers/app/memory')),
		events: async() => (await import('@ogen-providers/app/events')),
	}
)

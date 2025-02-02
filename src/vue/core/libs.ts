import { defineAsyncComponent, h } from "vue";
import { nextConsole } from "@ogen-composables/helpers/useDevTools"
// import { IPCManager } from "@ogen-composables/useIPC";
const console = nextConsole('ProviderFactory', { color: '#FFFFFF', background: '#448d44'})

const RAM_PROVIDERS = new Map();
export async function createProvider<ProviderType>(namespace: string, files: any) {
    

    let provider = RAM_PROVIDERS.get(namespace)
    if (!provider) {
        console.log(`Initializing provider : ${namespace}`);
        provider = {} as any;
        provider.setup= typeof files.setup !== 'undefined' ? await files.setup() : undefined;
        provider.api = typeof files.api !== 'undefined' ? await files.api() : undefined;
        provider.actions = typeof files.actions !== 'undefined' ? await files.actions() : undefined;
        provider.composables = typeof files.composables !== 'undefined' ? await files.composables() : undefined;
        provider.memory = typeof files.memory !== 'undefined' ? await files.memory() : undefined;
        provider.events = typeof files.events !== 'undefined' ? await files.events() : undefined;
        // provider.ipc = files.ipc ? files.ipc() : undefined;

        if (provider.setup && typeof provider.setup.bootstrap === 'function')
            provider.setup.bootstrap();

        //DevNote : For ElectronJS
        // if (provider.ipc && provider.ipc.default)
        //     IPCManager.enable(provider.ipc.default);
        
        RAM_PROVIDERS.set(namespace, provider);
    }

    return provider as ProviderType;
}

export const defineAsyncComponentWithLoader = (component: any, { component: loaderComponent, props = {} }: any) => {
    return defineAsyncComponent({
        loader: component,
        loadingComponent: LoadingWrapper(loaderComponent, props),
        suspensible: false,
        // Delay before showing the loading component. Default: 200ms.
        delay: 200,
        // A component to use if the load fails
        // errorComponent: ErrorComponent,
        // The error component will be displayed if a timeout is
        // provided and exceeded. Default: Infinity.
        // timeout: 3000
    })
}

const LoadingWrapper = (loadingComponent: any, props: any) => {
    return {
        render() {
            return h(loadingComponent, props);
        }
    };
};
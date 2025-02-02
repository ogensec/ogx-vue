import {DEV_CONSOLE, DEV_CONSOLE_DEBUG } from "@app-config";

// import {MEM_DEVICE_PLATFORMS} from '@/app.memory';
// import {Platform} from 'react-native';

/*
/* Platform functionss
*/
//
// export const isPlatformAndroid = () => {
//     if (Platform.OS === MEM_DEVICE_PLATFORMS.ANDROID) return true;
//     return false;
// };
// export const isPlatformIOS = () => {
//     if (Platform.OS === MEM_DEVICE_PLATFORMS.IOS) return true;
//     return false;
// };

export const getURLPath = (url: string) => {
    return new URL(`${url}`, import.meta.url).href
}
/*
/* Handling unit echo for component
*/
const LINE_LENGTH: number = 35;
let lastEcho: string | null = null;
let lastLineLength: number = LINE_LENGTH;

type TNextConsole = {
    log: Console['log'],
    warn: Console['warn']
    error: Console['error']
}
export const nextConsole = (namespace: string, styles: any, trace:boolean = false, group:boolean = false): Console => {
    let method = trace || DEV_CONSOLE_DEBUG ? "warn" : "log";
    const func: Console = {
        ...console,
        log: function (...args) {

            let addedStyles = Object.keys(styles).reduce((acc:any, key:any) => { return `${acc}${camelToKebabCase(key)}:${styles[key]};`; }, '');
            if (namespace.includes("Worker") || lastEcho !== namespace || !group)
                console[method as 'log' | 'warn'](`%c | ${namespace} ► `,`${addedStyles}`, ...args, );
            else
                console[method as 'log' | 'warn'](
                    `%c | ${" ".repeat(namespace.toString().length)} ► `,
                    `${ addedStyles }`,
                    ...args
                );
            lastEcho = namespace;
        },
    }
    func.error = console.error;
    func.warn = (...args) => (func.log ? func.log.call(args[0], ...args.slice(1)) : undefined)
    return func;
};

export function getCallerFunction(jump?: number) {
    const stack = new Error().stack;
    if (!jump) jump = 0;
    let callers: string[] = [];
    let caller: string | null = null;

    if (stack) {
        const stackSplitted = stack.split('\n');
        let i = 0;
        // console.log(stackSplitted)
        while (!caller && i < stackSplitted.length) {
            let current = stackSplitted[i].trim().split(' ')[1];
            if (!BLACKLIST_FUNC.includes(current)) {
                if (!jump) caller = current;
                else jump--;
            }
            // if (
            //     !BLACKLIST_FUNC.includes(current)
            //     && !BACKLIST_EXTENDS.includes(current)
            //     && !callers.includes(current)
            //     && !callers.map((e) => '_'+e).includes(current)
            //     && !callers.map((e) => e.substring(1)).includes(current))
            // {
            //     callers.push(current);
            // }

            i++;
        }
    }
    if (!caller) caller = 'anonymous';
    return caller;
    // if (!caller.length) caller.push('anonymous')
    // return caller.join(' > ')
}

const BLACKLIST_FUNC = [
    undefined,
    null,
    0,
    '',
    '__callFunction',
    '__callReactNativeMicrotasks',
    '__guard',
    '_callFunction',
    '_callReactNativeMicrotasksPass',
    '_callTimer',
    '_default',
    '_next',
    '_c',
    '?anon_0_',
    'anonymous',
    'apply',
    'apply',
    'asyncGeneratorStep',
    'beginWork',
    'beginWork$1',
    'call',
    'callFunctionReturnFlushedQueue',
    'callReactNativeMicrotasks',
    'commitHookEffectListMount',
    'commitPassiveMountEffects_begin',
    'commitPassiveMountEffects_complete',
    'commitPassiveMountEffects',
    'commitPassiveMountOnFiber',
    'dev',
    'doResolve',
    'executeAction',
    'flushedQueue',
    'flushPassiveEffects',
    'flushPassiveEffectsImpl',
    'flushSyncCallbacks',
    'flushSyncCallbacksOnlyInLegacyMode',
    'getCallerFunction',
    'guardedLoadModule',
    'invokeCallbackAndReturnFlushedQueue',
    'loadModuleImplementation',
    'metroRequire',
    'mountIndeterminateComponent',
    'next',
    'observeComponent',
    'observerComponent',
    'performSyncWorkOnRoot',
    'performUnitOfWork',
    'Promise',
    'render',
    'renderApplication',
    'renderElement',
    'renderRootSync',
    'renderWithHooks',
    'run',
    'runApplication',
    'scheduleUpdateOnFiber',
    'track',
    'trackDerivedFunction',
    'tryCallOne',
    'tryCallTwo',
    'updateContainer',
    'updateFunctionComponent',
    'updateMemoComponent',
    'updateSimpleMemoComponent',
    'useObserver',
    // 'use',
    'workLoopSync'
];

const BACKLIST_EXTENDS = BLACKLIST_FUNC.map(e => '_' + e);
/**
 * Camel Case to Kebab Case
 * @param str
 * @returns {string}
 */
export const camelToKebabCase = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Kebab Case to Camel Case
 * @param str
 * @returns {*}
 */
export const kebabToCamelCase = (str: string): any => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

import type { APIResponse } from "@ogen-providers/app/composables/useApi";
import type { Ref } from "vue";


export type THTMLLibraryEntries = {
    [key: string]: THTMLLibraryEntry;
};

export type THTMLLibraryEntry = {
    type: THTMLTypes;
    file?: string;
    url?: string;
};

export type THTMLTypes = 'local' | 'remote';
export const HTMLTypeLocal = 'local';
export const HTMLTypeRemote = 'remote';

//utils

type OptionalPropertyNames<T> = {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
    [P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
    Pick<L, Exclude<keyof L, keyof R>> &
        Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
        Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
        SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown;

export type ActionResponse<C> = ('response' extends keyof C ? APIResponse<C['response']> : never) | false;

export type ContainsString<T extends string, U extends string> = T extends `${infer L}${U}${infer R}`
    ? true
    : T extends `${infer L}${U}`
      ? true
      : T extends `${U}${infer R}`
        ? true
        : false;


export type TInputsType = {
    [key: string]: {
        NAME: string,
        REF: Ref<any>
    }
}
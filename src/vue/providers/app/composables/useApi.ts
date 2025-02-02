import type { AxiosInstance, AxiosResponse } from 'axios';
import useRequest from './helpers/useRequest';
import useResponse from './helpers/useResponse';
import type { ContainsString } from '@ogen-core';
import { nextConsole } from "@ogen-composables/helpers/useDevTools";
const console = nextConsole('API[Request]', { color: '#ffffff', backgroundColor: 'red' });

export const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    UPDATE: 'UPDATE',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
} as const;

export type APIResponse<TResponse> = {
    status: number;
    data?: TResponse;
    isSuccess: boolean;
    errors?: any;
};

export type APIRequest<TResponse> = {
    method: (typeof METHOD)[keyof typeof METHOD];
    path: string;
    exec: () => Promise<AxiosResponse<TResponse>>;
};

export type Validator<T> = (value: any) => value is T;

type RequestField<T extends boolean, V extends Validator<any>[]> = T extends true
    ? V[number] extends Validator<infer U>
        ? U
        : never
    : T extends false
        ? undefined | (V[number] extends Validator<infer U> ? U : never)
        : undefined;

type ParamsType<
  B extends Record<string, { required?: boolean; validators: Validator<any>[] }>
> = {
    [K in keyof B]: B[K]['required'] extends true
      ? RequestField<true, B[K]['validators']>
      : RequestField<false, B[K]['validators']> | undefined;
};


export type ResponseType<R extends Record<string, Validator<any>[]>> = {
    [K in keyof R]: RequestField<true, R[K]>;
};

type MandatoryParamsType<P extends string, R extends Record<string, Validator<any>[]>> = {
    [K in Extract<keyof R, string>]: ContainsString<P, K> extends true ? RequestField<true, R[K]> : `❌ CAUTION: this params doesn't exist in route path.`;
};

export type RequestConstructor = {
    api: AxiosInstance;
    method: (typeof METHOD)[keyof typeof METHOD];
    path: string;
    body?: {
        [key: string]: any;
    };
    query?: {
        [key: string]: any;
    };
    params?: {
        [key: string]: any;
    };
    response?: any;
};

export type RequestConstructorWithoutOptions = {
	api: AxiosInstance;
	method: (typeof METHOD)[keyof typeof METHOD];
	path: string;
}



export type CorrectValues<C extends (RequestConstructor | RequestConstructorWithoutOptions)> =
    (C extends RequestConstructorWithoutOptions ? undefined : Omit<C, 'api' | 'method' | 'path' | 'response'>) |
    (C extends  RequestConstructor ? {
    body?: C['body'] extends Record<string, any> ? { [K in keyof C['body']]: C['body'][K] } : never;
    query?: C['query'] extends Record<string, any> ? { [K in keyof C['query']]: C['query'][K] } : never;
    params?: C['params'] extends Record<string, any> ? { [K in keyof C['params']]: C['params'][K] } : never;
    } : never)

/**
 * useApi
 * @param requestConstructor
 * @param requestValues
 */
export default async <TResponse, C extends RequestConstructor, V extends CorrectValues<C>>(requestConstructor: C, requestValues?: CorrectValues<C>): Promise<APIResponse<C['response']>> => {
    let response: any
    let valuesKeys = requestValues ? Object.keys(requestValues) : null;

    // Shortcut for POST : If no 'params','query','body' keys in requestValues object, so it is 'body' object itself.
    if (valuesKeys && valuesKeys.length && !valuesKeys.some(key => ['path', 'params', 'query', 'body'].includes(key))) {
        const body = { ...requestValues as object };
        requestValues = {
            body: body
        } as V;
    }

    const request = useRequest(requestConstructor, requestValues);

    if (request) {
        console.log('►►►', request.method.toUpperCase(), request.path, requestConstructor, requestValues);
        response = useResponse<TResponse>({ method: request.method, path: request.path, exec: request.exec });
    } else throw new Error('Something went wront with your API request.');
    return response;
};

export function createEndpoint<
    A extends AxiosInstance,
    M extends (typeof METHOD)[keyof typeof METHOD],
    P extends string,
    R extends Record<string, Validator<any>[]>
>(
    { api, method, path }: { api: A; method: M; path: P; },
    response?: R
): { api: A; method: M; path: P; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends (typeof METHOD)[keyof typeof METHOD],
    P extends string,
    O extends Record<string, Validator<any>[]>,
    R extends Record<string, Validator<any>[]>
>(
    { api, method, path, params }: { api: A; method: M; path: P; params: O },
    response?: R
): { api: A; method: M; path: P; params: MandatoryParamsType<P, O>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends (typeof METHOD)[keyof typeof METHOD],
    P extends string,
    Q extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>({ api, method, path, query }: { api: A; method: M; path: P; query: Q }, response?: R): { api: A; method: M; path: P; query: ParamsType<Q>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends typeof METHOD.PUT | typeof METHOD.POST | typeof METHOD.UPDATE | typeof METHOD.DELETE | typeof METHOD.PATCH,
    P extends string,
    B extends Record<string, { required?: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>({ api, method, path, body }: { api: A; method: M; path: P; body: B }, response?: R): { api: A; method: M; path: P; body: ParamsType<B>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends typeof METHOD.PUT | typeof METHOD.POST | typeof METHOD.UPDATE | typeof METHOD.DELETE | typeof METHOD.PATCH,
    P extends string,
    Q extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    B extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>(
    { api, method, path, query, body }: { api: A; method: M; path: P; query: Q; body: B },
    response?: R
): { api: A; method: M; path: P; query: ParamsType<Q>; body: ParamsType<B>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends typeof METHOD.PUT | typeof METHOD.POST | typeof METHOD.UPDATE | typeof METHOD.DELETE | typeof METHOD.PATCH,
    P extends string,
    O extends Record<string, Validator<any>[]>,
    B extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>(
    { api, method, path, params, body }: { api: A; method: M; path: P; params: O; body: B },
    response?: R
): { api: A; method: M; path: P; params: MandatoryParamsType<P, O>; body: ParamsType<B>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends (typeof METHOD)[keyof typeof METHOD],
    P extends string,
    O extends Record<string, Validator<any>[]>,
    Q extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>(
    { api, method, path, params, query }: { api: A; method: M; path: P; params: O; query: Q },
    response?: R
): { api: A; method: M; path: P; params: MandatoryParamsType<P, O>; query: ParamsType<Q>; response: ResponseType<R> };

export function createEndpoint<
    A extends AxiosInstance,
    M extends (typeof METHOD)[keyof typeof METHOD],
    P extends string,
    O extends Record<string, Validator<any>[]>,
    Q extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    B extends Record<string, { required: boolean; validators: Validator<any>[] }>,
    R extends Record<string, Validator<any>[]>
>({ api, method, path, body, params, query }: { api: A; method: M; path: P; query?: ParamsType<Q>; params?: MandatoryParamsType<P, O>; body?: ParamsType<B> }, response?: R) {
    //DevNote: Add verification to check if params[key] are available in 'path'
    return {
        api,
        method,
        path,
        body,
        query,
        params,
        response
    } as {
        api: A;
        method: M;
        path: P;
        body?: ParamsType<B>;
        query?: ParamsType<Q>;
        params?: MandatoryParamsType<P, O>;
        response?: ResponseType<R>;
    };
}

import { nextConsole } from '@ogen-composables/helpers/useDevTools';
import type { APIRequest, APIResponse } from '@ogen-providers/app/composables/useApi';

const console = nextConsole('API[Response]', { color: '#ffffff', backgroundColor: 'red' });
/**
 * useResponse
 * @param method
 * @param path
 * @param exec
 */
export default async function useResponse<CustomResponse>({ method, path, exec }: APIRequest<CustomResponse>): Promise<APIResponse<CustomResponse>> {
    let response: APIResponse<CustomResponse> = {} as APIResponse<CustomResponse>;

    if (typeof exec === 'function') {
        return exec()
            .then((requestHTTP: any) => {
                const responseHTTP = requestHTTP.data
                if (typeof responseHTTP === 'object') {
                    if (!responseHTTP.errors) {
                        response.status = responseHTTP.code || 200;
                        response.data = responseHTTP.data || requestHTTP;
                        response.isSuccess = true;
                    } else {
                        if (!responseHTTP.code) responseHTTP.code = 403;
                        response.status = responseHTTP.code;
                        response.errors = responseHTTP.errors;
                        response.isSuccess = false;
                    }
                } else {
                    response.status = 200;
                    response.data = responseHTTP;
                    response.isSuccess = true;
                }
                console.log('◄◄◄', method.toUpperCase(), path, response);
                return response;
            })
            .catch((e: any) => {
                console.error(e);
                console.log('def errors', e?.response?.data?.errors );
                const errors = e?.response?.data?.errors || [{code: 500, type: 'internal', message: e.message} ]
                response.errors = errors as CustomResponse;
                response.status = e.response?.status;
                response.isSuccess = false;
                return response;
            });
    } else {
        console.error('Request function is not a function');
        return {
            status: 500,
            isSuccess: false
        };
    }
}

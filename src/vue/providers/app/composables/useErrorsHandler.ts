import { defineComponent, ref, reactive, computed, inject, watch } from 'vue';
import type { APIResponse } from "./useApi";

type ApiErrors = {
	basic:  { [key: string]: string[] | undefined }
	system: { [key: string]: string[] | undefined }
}



const SYSTEM_ERRORS = [ 'api', 'internal' ];


function useErrorsHandler(response: APIResponse<any>): ApiErrors {
	
		const basic = {};
		const system = {};
		
		for (let error of response.errors) {
			if (SYSTEM_ERRORS.includes(error.type)) {
				if (!system[error.type]) system[error.type] = [];
				system[error.type].push(error.message);
			}
			else {
				if (!basic[error.type]) basic[error.type] = [];
				basic[error.type].push(error.message);
			}
		}
		
		if (system.internal) {}
		if (system.api) {}
		
		return { basic, system };
}

export default useErrorsHandler;
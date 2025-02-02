import type {Validator} from '@ogen-providers/app/composables/useApi';

export const isNumber: Validator<number> = (value: any): value is number => typeof value === 'number';

export const isString: Validator<string> = (value: any): value is string => typeof value === 'string';
export const isBoolean: Validator<boolean> = (value: any): value is boolean => typeof value === 'boolean';
export const isArray: Validator<typeof Array> = (value: any): value is typeof Array => Array.isArray(value);
export const isAny: Validator<any> = (value: any): value is any => true;

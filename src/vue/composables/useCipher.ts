import { createSHA3, pbkdf2 } from 'hash-wasm';


export const generatePBKDF2 = async (key: string, salt: string, iteration: number, hashLength: number, outputType: 'hex' | 'binary' = 'binary') : Promise<Uint8Array> => {
	return await pbkdf2({
		password: stringToUint8Array(key),
		salt: stringToUint8Array(salt),
		iterations: iteration,
		hashLength: hashLength,
		hashFunction: createSHA3(512),
		outputType: outputType as 'binary',
	}) 
}

function stringToUint8Array(str: string): Uint8Array {
	const charCodes = Array.from(str).map(char => char.charCodeAt(0));
	return new Uint8Array(charCodes);
}
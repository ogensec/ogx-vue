/**
 * Declare workers here
 */
export default {
	crypter:  () => new Worker(new URL('@ogen-vue/workers/crypter-worker.ts', import.meta.url), { type: 'module' }) as TWorkerCrypter,
}

/**
 * Declare workers types here
 */
export type TWorkerCrypter = Worker & {
	HASH_PASSWORD: {
		data: {
			content: string
			salt: string
		},
		response: {
			hashed: string;
		}
	},
	ENCODE_TEXT: {
		data: {
			content: string,
			masterkey: string,
			subKeys: string[],
			inputType: string,
			outputType: string,
		},
		response: {
			encoded: string
		}
	},
}

export type TWorkerIndexerDB = Worker & {

}

export type TWorkerCrypto = Worker & {

}


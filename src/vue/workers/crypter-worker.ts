//@ts-nocheck
import { createSHA3, pbkdf2 } from 'hash-wasm';


// Base worker listeners (don't touch it.)
self.addEventListener('message', (e) => {

	console.log('message', e.data);
	let event = e.data;
	let eventId = event.eventId || null;
	let cmd = event.cmd || null;
	let value = event.data || null;

	if(self[cmd])
		{
			self[cmd](value).then((response) => {
						self.postMessage({
							type: 'callback',
							eventId,
							value: response,
						});
					})
		}
	else {
		console.error('Worker -> Unknown command : '+cmd);
	}
})



/********* WORKER INTERFACE ***********/


/**
 * HASH PASSWORD
 * @param content
 * @param salt
 * @constructor
 */
self.HASH_PASSWORD = async({ content, salt }) => {
	try {
		return await pbkdf2({
			password: content,
			iterations: 7,
			salt: salt,
			hashLength: 64,
			hashFunction: createSHA3(512),
			outputType: 'hex'
		});
	}
	catch(e) {
		console.error(e);
		return e
	}

}




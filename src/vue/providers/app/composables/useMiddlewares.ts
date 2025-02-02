
export default async function({ middlewares} : any) {
	if (typeof middlewares === 'function') { middlewares = [middlewares] }
	let s = null;
	for(let middleware of middlewares) {
		s = await middleware();
		if (s !== false) return s;
	}
	return s;
}
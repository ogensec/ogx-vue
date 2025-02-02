export const generateRange = ({from = 0, to, step = 1, length = Math.ceil((to - from) / step)}) => Array.from({length}, (_, i) => from + i * step)


export const generateRandomKey = (length: number) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*/-+)({}|@=[]';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};
export const COLORS = {
	VIVE: 'vive',
	DARK: 'dark',
};

export function getRandomColor(type: string) {
	const min = type === COLORS.VIVE ? 128 : 50; // Valeur minimale pour chaque canal RGB
	const max = type === COLORS.VIVE ? 255 : 128; // Valeur maximale pour chaque canal RGB
	let r: number, g: number, b: number;

	do {
		r = Math.floor(Math.random() * (max - min) + min);
		g = Math.floor(Math.random() * (max - min) + min);
		b = Math.floor(Math.random() * (max - min) + min);
	} while (type === COLORS.VIVE ? ((r + g + b) / 3 < 128 || (r + g + b) / 3 > 224)
		: ((r + g + b) / 3 < 10 || (r + g + b) / 3 > 96)); // Vérifie que la couleur est vive ou sombre

	const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	return hexColor;
}

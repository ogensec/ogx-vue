import { ref, watch, onMounted } from 'vue';

interface UseImageProps {
	path: string;
	icon: string;
	theme: string;
}

export default function useThemedImage({ path, icon, theme }: UseImageProps) {
	const imageSrc = ref<string | null>(null);

	const loadImage = () => {
		try {
			const formattedIcon = icon.replace('*', theme);
			imageSrc.value = new URL(`/src/assets/images/${ path+formattedIcon }`, import.meta.url).href;
		} catch (error) {
			console.error('Error loading image:', error);
			imageSrc.value = null;
		}
	};

	watch(() => theme, (next) => {
		loadImage();
	}, { immediate: true });

	loadImage();
	
	return imageSrc;

}

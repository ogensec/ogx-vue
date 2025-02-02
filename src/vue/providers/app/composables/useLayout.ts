import { useAppProvider } from "@providers";

export default async function useLayout(name: string, props: any = {}) {
	const { memory: { reactives: AppReactives } } = await useAppProvider();

	if (AppReactives.layout.name !== name) {
		AppReactives.layout = {
			name,
			props
		}
	}
}
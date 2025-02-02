import { nextConsole } from "@ogen-composables/helpers/useDevTools";

const console = nextConsole('useMeta', { color: 'black', backgroundColor: '#73dfff' });

export default function useMeta(metaOptions) {
	// Fonction pour créer ou mettre à jour un élément head
	
	console.log('useMeta',metaOptions);
	const updateOrCreateMetaTag = (name, content) => {
		let element = document.head.querySelector(`meta[name="${name}"]`);
		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('name', name);
			document.head.appendChild(element);
		}
		element.setAttribute('content', content);
	};

	// Fonction pour créer ou mettre à jour un link rel
	const updateOrCreateLinkTag = (rel, href) => {
		let element = document.head.querySelector(`link[rel="${rel}"]`);
		if (!element) {
			element = document.createElement('link');
			element.setAttribute('rel', rel);
			document.head.appendChild(element);
		}
		element.setAttribute('href', href);
	};

	// Fonction pour mettre à jour le titre de la page
	const updateTitle = (title) => {
		if (title) {
			document.title = title;
		}
	};

	// Applique les options meta
	const applyMetaOptions = (options) => {
		if (options?.title) {
			updateTitle(options.title);
			delete options.title;
		}
		if (options?.meta) {
			Object.keys(options.meta).forEach(key => {
				updateOrCreateMetaTag(key, options.meta[key]);
			});
		}
		if (options?.link) {
			Object.keys(options.link).forEach(key => {
				updateOrCreateLinkTag(key, options.link[key]);
			});
		}
	};

	// Nettoyer les balises meta
	const clearMetaOptions = (options) => {
		if (options?.title) {
			document.title = ''; // ou remettre le titre par défaut
			delete options.title;
		}
		if (options?.meta) {
			Object.keys(options.meta).forEach(key => {
				const element = document.head.querySelector(`meta[name="${key}"]`);
				if (element) {
					document.head.removeChild(element);
				}
			});
		}
		if (options?.link) {
			Object.keys(options.link).forEach(key => {
				const element = document.head.querySelector(`link[rel="${key}"]`);
				if (element) {
					document.head.removeChild(element);
				}
			});
		}
	};

	// Appliquer et nettoyer les options meta
	applyMetaOptions(metaOptions);
	return () => {
		clearMetaOptions(metaOptions);
	};
}
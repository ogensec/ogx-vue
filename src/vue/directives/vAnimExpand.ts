import { nextTick } from 'vue';

export default {
	mounted(el, binding) {

		el._config = {
			expand: binding.value.expand,
			time: binding.value.time || 1000,
			delay: binding.value.delay || 0,
		}
		el._isOpen = false;
		el.style.maxHeight = '0';
		el.style.overflow = 'hidden';
		el.style.transition = `max-height ${ el._config.time }ms ease, height ${ el._config.time }ms ease`;

		// Observer pour les changements de contenu
		el._mutationObserver = new MutationObserver(() => {
			if (el._isOpen) {
				setTimeout(() => {
					nextTick(() => {
						el.style.maxHeight = el.scrollHeight + 'px';
					}).finally()
				}, el._config.delay)

			}
		});
		el._mutationObserver.observe(el, { childList: true, subtree: true });

		if (el._config.expand) {
			setTimeout(() => {
				nextTick(() => {
					el.style.maxHeight = el.scrollHeight + 'px';
					el._isOpen = true;
				}).finally()
			}, el._config.delay)

		}
	},
	updated(el, binding) {

		
		el._config.delay = binding.value.delay;
		el._config.time = binding.value.time
		
		if (binding.value.expand) {
			el._isOpen = true;
			setTimeout(() => {
		
				el.style.maxHeight = el.scrollHeight + 'px';
			}, el._config.delay)
		} else {
			el.style.maxHeight = '0';
			el._isOpen = false;
		}
	},
	beforeUnmount(el) {
		el.style.maxHeight = null;
		el.style.overflow = null;
		el.style.transition = null;

		if (el._mutationObserver) {
			el._mutationObserver.disconnect();
			el._mutationObserver = null;
		}
	},
};

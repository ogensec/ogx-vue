import './vTooltip.css';

const DOM_ATTACH = '#app-container';

type TooltipBindingValue = {
	text?: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	class?: string;
	disabled?: boolean;
};

type TooltipElement = HTMLElement & {
	__tooltip: {
		elem: HTMLDivElement;
		updateClass: (el: HTMLElement, binding: TooltipBinding, position: string) => void;
		getPosition: (binding: TooltipBinding) => string;
	};
};

type TooltipBinding = {
	value: TooltipBindingValue;
};

export default {
	created(el: TooltipElement, binding: TooltipBinding) {
		const tooltipEl = document.createElement('div');
		el.__tooltip = {
			updateClass: (el: any, binding: any, position: any) => {
				if (binding.value.class) el.classList.add(binding.value.class);
				el.classList.add('v-tooltip');
				el.classList.add(`v-tooltip--${position}`);
			},

			getPosition: (binding: any) => {
				return binding.value.position || 'top';
			},
		} as any;

		el.classList.add('with-tooltip');
		tooltipEl.setAttribute('data-tooltip', binding.value?.text || 'no_text_provided');
		tooltipEl.textContent = binding.value.text || 'no_text_provided';
		el.__tooltip.updateClass(tooltipEl, binding, el.__tooltip.getPosition(binding));

		tooltipEl.style.position = 'absolute';
		tooltipEl.style.zIndex = '10';
		tooltipEl.style.padding = '8px 8px';
		tooltipEl.style.borderRadius = '5px';
		tooltipEl.style.display = 'none';
		tooltipEl.style.transition = 'opacity 0.5s';

		let isShown = false;
		let timeoutDisplay: ReturnType<typeof setTimeout> | null = null;
		let timeoutHide: ReturnType<typeof setTimeout> | null = null;

		const setPosition = () => {
			const rect = el.getBoundingClientRect();

			let top: number = 0;
			let left: number = 0;
			switch (el.__tooltip!.getPosition(binding)) {
				case 'top':
					top = rect.top - tooltipEl.offsetHeight - 5;
					left = rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;
					break;
				case 'bottom':
					top = rect.bottom + 10;
					left = rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;
					break;
				case 'left':
					top = rect.top + rect.height / 2 - tooltipEl.offsetHeight / 2;
					left = rect.left - tooltipEl.offsetWidth - 10;
					break;
				case 'right':
					top = rect.top + rect.height / 2 - tooltipEl.offsetHeight / 2;
					left = rect.right + 10;
					break;
			}
			tooltipEl.style.top = `${top}px`;
			tooltipEl.style.left = `${left}px`;
		};

		const showTooltip = (event: MouseEvent) => {
			if (binding.value.disabled || isShown) {
				return;
			}

			isShown = true;
			if (timeoutDisplay) clearTimeout(timeoutDisplay);
			document.querySelector(DOM_ATTACH)?.appendChild(tooltipEl);

			tooltipEl.style.opacity = '0';
			tooltipEl.style.display = 'block';

			timeoutDisplay = setTimeout(() => {
				setPosition();
				tooltipEl.style.opacity = '';
			}, 150);
		};

		const hideTooltip = (event: MouseEvent) => {
			if (!event.currentTarget || !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
				if (!isShown) return;

				if (timeoutDisplay) clearTimeout(timeoutDisplay);
				if (timeoutHide) clearTimeout(timeoutHide);
				tooltipEl.style.opacity = '0';

				timeoutHide = setTimeout(() => {
					tooltipEl.remove();
					isShown = false;
				}, 50);
			}
		};

		el.addEventListener('mouseenter', showTooltip);
		el.addEventListener('mouseleave', hideTooltip);

		el.__tooltip.elem = tooltipEl;
	},

	updated(el: TooltipElement, binding: TooltipBinding) {
		if (el.__tooltip?.elem) {
			el.__tooltip.elem.textContent = binding.value.text || 'no_text_provided';
			el.__tooltip.updateClass(el.__tooltip.elem, binding, el.__tooltip.getPosition(binding));
		}
	},

	unbind(el: TooltipElement) {
		if (el.__tooltip?.elem) {
			el.__tooltip.elem.remove();
		}
		el.removeEventListener('mouseenter', () => {});
		el.removeEventListener('mouseleave', () => {});
	},
};

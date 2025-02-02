/* eslint-disable no-unused-vars */
import type { Ref } from 'vue';
import { ref, watch, computed } from 'vue';


type Breakpoints = {
	xs: boolean;
	sm: boolean;
	md: boolean;
	lg: boolean;
	xl: boolean;
	xll: boolean;
}

type Conditions =  {
	xsAndUp: boolean;
	smAndDown: boolean;
	smAndUp: boolean;
	mdAndDown: boolean;
	mdAndUp: boolean;
	lgAndDown: boolean;
	lgAndUp: boolean;
	xlAndDown: boolean;
	xlAndUp: boolean;
	xllAndDown: boolean;
	xllAndUp: boolean;
}

type BreakpointResult = Breakpoints & Conditions;

export default function useBreakpoints(width: Ref<number>, matrice: number[] = [420, 680, 920, 1024, 1920]) {
	return computed(() => {
		return refreshBreakpoints(width.value, matrice);
	});
}

const refreshBreakpoints = (width: number, matrice: number[]): BreakpointResult => {
	const sizes: Breakpoints = {
		xs: width > 0 && width <= matrice[0],
		sm: width > matrice[0] && width <= matrice[1],
		md: width > matrice[1] && width <= matrice[2],
		lg: width > matrice[2] && width <= matrice[3],
		xl: width > matrice[3] && width <= matrice[4],
		xll: width > matrice[4],
	};

	const conditions: Conditions = {
		xsAndUp: [sizes.xs, sizes.sm, sizes.md, sizes.lg, sizes.xl, sizes.xll].includes(true),
		smAndDown: [sizes.xs, sizes.sm].includes(true),
		smAndUp: [sizes.sm, sizes.md, sizes.lg, sizes.xl, sizes.xll].includes(true),
		mdAndDown: [sizes.xs, sizes.sm, sizes.md].includes(true),
		mdAndUp: [sizes.md, sizes.lg, sizes.xl, sizes.xll].includes(true),
		lgAndDown: [sizes.xs, sizes.sm, sizes.md, sizes.lg].includes(true),
		lgAndUp: [sizes.lg, sizes.xl, sizes.xll].includes(true),
		xlAndDown: [sizes.xs, sizes.sm, sizes.md, sizes.lg, sizes.xl].includes(true),
		xlAndUp: [sizes.xl, sizes.xll].includes(true),
		xllAndDown: [sizes.xs, sizes.sm, sizes.md, sizes.lg, sizes.xl, sizes.xll].includes(true),
		xllAndUp: [sizes.xll].includes(true),
	};

	return {
		...sizes,
		...conditions,
	};
};


<script>
export default {
	name: 'BaseDivider',
	props: {
		vertical: {
			type: Boolean,
			default: false
		},
		inset: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		dividerClass() {
			return {
				'b-divider': true,
				'b-divider--vertical': this.vertical,
				'b-divider--inset': this.inset
			};
		}
	}
};
</script>

<template>
<div :class="dividerClass"></div>
</template>

<style lang="scss">
.b-divider {
	height: 1px;
	width: 100%;

	margin: 8px 0;
}

.b-divider--vertical {
	width: 1px;
	height: 100%;
}

.b-divider--inset {
	margin-left: 72px;
}

.light {
	.b-divider {
		background-color: rgba(0, 0, 0, 0.12);
	}
}

.dark {
	.b-divider {
		background-color: rgba(255, 255, 255, 0.12);
	}
}
</style>
<script setup lang="ts">

import type { Ref } from 'vue';
import { ref, computed } from 'vue';

export type TPanel = {
	id: string;
	label: string;
	items: TPanelItem[]
}

type TPanelItem = {
	label: string
	onActive: () => any,
}

type TPanelItemComputed = {
	label: string
	onActive: () => any,
	isActive: Ref<boolean>
}

type TPanelComputed = TPanel & {
	isExpanded?: Ref<boolean>
}


type TExpandPanelsProps = {
	multiple: true,
	itemHeight?: number,
	panelsList: TPanel[];
	animationDuration?: number,
}


const props = withDefaults(defineProps<TExpandPanelsProps>(), {
	multiple: true,
	itemHeight: 40,
	animationDuration: 200,
});

const computedPanels = computed(() => {
	return props.panelsList.map((panel) => {
		return {
			...panel,
			isExpanded: ref(false),
			items: panel.items.map((item: TPanelItemComputed) => ({ ...item, isActive: ref(false) }))
		} as TPanelComputed
	})
})

const styleItem = computed(() => {
	return {
		height: `${ props.itemHeight }px`
	}
})

const getStylePanelList = (panel: TPanelComputed) => {
	let style = {
		transition: `all ${ props.animationDuration }ms`
	}
	if (panel.isExpanded.value) {
		return {
			...style,
			height: (panel.items.length * props.itemHeight) + 'px',
		}
	} else
		return {
			...style,
			height: '0px',
		}
}
const toggleExpandPanel = (panel: TPanelComputed) => {
	panel.isExpanded.value = !panel.isExpanded.value;
}

const onClickItem = (panel: TPanelComputed, item: TPanelItemComputed) => {
	for (let panelIteration of computedPanels.value) {
		if (panelIteration.id !== panel.id) panelIteration.isExpanded.value = false;
		panelIteration.items.forEach((itemIterate: TPanelItemComputed) => {
			itemIterate.isActive.value = false;
		})
	}

	item.isActive.value = true;
	if (item.onActive) item.onActive();
}
</script>

<template>
<div class="expand-panel">
	<div class="panel" v-for="(panel) in computedPanels" :class="{ expanded: panel.isExpanded.value }">
		<div class="header" @click="() => toggleExpandPanel(panel)">
			<div class="label">
				{{ panel.label }}
			</div>
			<div class="arrow">
				<span>{{ panel.isExpanded.value ? '&#9660;' : '&#9658;' }}</span>
			</div>
	
		</div>
		<div class="list" :style="getStylePanelList(panel)">
			<div class="item" v-for="(item) in panel.items" :style="styleItem" @click="() => onClickItem(panel,item)"
			     :class="{ active: item.isActive.value }">
				{{ item.label }}
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss">
.expand-panel {
	overflow: hidden;

	.header {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
	}

	.list {
		overflow: hidden;
		transition: all 0.2s;

		.item {
			width: 100%;
			
		}
	}
}
</style>

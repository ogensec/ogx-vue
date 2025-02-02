<script setup lang="ts">
/* eslint-disable no-unused-vars */

const props = defineProps({
	onTerminate: {
		type: Function,
	},
	onCancel: {
		type: Function,
	},
	text: {
		type: String,
		default: null,
	},
	textConfirm: {
		type: String,
		default: 'OK',
	},
	textCancel: {
		type: String,
		default: 'Cancel',
	},
	darkMode: {
		type: Boolean,
		default: false,
	},
});

const onClickConfirm = () => {
	// emit('onTerminate')
	props.onTerminate();
};

const onClickCancel = () => {
	// emit('onCancel')
	props.onCancel();
};
</script>

<template>
<div class="dialog-boolean" data-test="confirmation_dialog">
	<div class="custom-card-text d-flex justify-center">
		<div class="custom-col">
			<div
				style="text-align: center; font-size: 14px; margin: 5px"
				class="custom-row d-flex justify-center"
			>
				<div class="text-center font-weight-medium text-h6 mt-10">
					{{ props.text || 'confirm ?' }}
				</div>
			</div>
		</div>
	</div>
	<hr class="custom-divider">
	<div class="custom-card-actions">
		<div class="custom-spacer"></div>
		<button
			class="dialogButton secondaryButton"
			:class="{ 'dark': darkMode }"
			@click="onClickCancel"
			data-test="confirmation_dialog-no"
		>
			{{ props.textCancel || 'cancel' }}
		</button>

		<button
			class="dialogButton primaryButton"
			:class="{ 'dark': darkMode }"
			@click="onClickConfirm"
			data-test="confirmation_dialog-yes"
		>
			{{ props.textConfirm || 'confirm' }}
		</button>
	</div>
</div>
</template>

<style lang="scss">
.dialog-boolean {
	border: 1px solid var(--black-lighten8);
	border-radius: 4px;
	padding: 16px;
	background-color: var(--black-lighten9);


	.custom-card-text {
		display: flex;
		justify-content: center;
		margin-bottom: 16px;
	}

	.custom-row {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.custom-col {
		width: 100%;
	}

	.custom-divider {
		border: none;
		border-top: 1px solid #e0e0e0;
		margin: 16px 0;
	}

	.custom-card-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.custom-spacer {
		flex: 1;
	}

	.dialogButton {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;

		&.primaryButton {
			background-color: #1976d2;
			color: white;
		}

		&.secondaryButton {
			background-color: #e0e0e0;
			color: black;
		}

		&.dark {
			background-color: #424242;
			color: white;

			&.secondaryButton {
				background-color: #616161;
			}
		}
	}
}
</style>

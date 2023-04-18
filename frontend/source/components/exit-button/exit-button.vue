<template lang="pug">
button.tt-close(title="Exit" @click="openExitPopup")
	svg-icon(icon="close-x" size="24")
TutorialPopup(v-if="isPopupOpen" :min="156")
	template#header(#header) Are you sure you want to exit the tutorial?
	template(#body)
		p.tt-body-content
			| If you are sure to exit the tutorial press the
			b  'Yes'
			|  button.
	template(#footer)
		.tt-button-container
			button.tt-cancel(@click="closeExitPopup") No
			button.tt-exit(@click="exitTutorial") Yes
</template>

<script setup>
import {ref} from 'vue';
import SvgIcon from '../svg-icon/svg-icon.vue';
import TutorialPopup from '../tutorial-popup/tutorial-popup.vue';

const emit = defineEmits(['exit-tutorial']);

const isPopupOpen = ref(false);

const openExitPopup = () => {
	isPopupOpen.value = true;
};

const closeExitPopup = () => {
	isPopupOpen.value = false;
};

const exitTutorial = () => {
	isPopupOpen.value = false;
	emit('exit-tutorial');
};
</script>

<style scoped>
.tt-close {
	background: transparent;
	cursor: pointer;
	padding: 8px;
	position: absolute;
	right: 5px;
	top: 4px;
}

.tt-close svg {
	color: var(--color-normal);
	display: block;
}

.tt-close svg:hover {
	color: var(--color-base);
	transition: color 0.25s ease-in-out;
}

.tt-body-content {
	margin-top: 12px;
}

.tt-button-container {
	align-items: center;
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.tt-exit, .tt-cancel {
	border: 1px solid var(--color-normal);
	border-radius: 8px;
	cursor: pointer;
	padding: 8px;
}

.tt-exit:hover, .tt-cancel:hover {
	background: #e7e5de;
}

.tt-exit:focus, .tt-cancel:focus {
	outline: 1px solid var(--color-normal);
}
</style>

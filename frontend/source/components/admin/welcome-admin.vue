<template lang="pug">
tutorial-popup
	template(#header) Welcome to the Total Tutorial adjustment interface
	template(#body)
		p.tt-body-content Now, step by step, we can set the content of your visitors will see. You don't need any programming knowledge!
		p.tt-body-content Use the Action icons in the right panel to perform action, for example
			svg-icon.tt-icon(icon="add")
			i  "Create a new tutorial step"
			|  or
			|
			svg-icon.tt-icon(icon="download")
			i  "Download the compiled configuration"
			|  etc. Hold on your cursor above the buttons for more information!
		p.tt-body-content Let's start!
	template(#footer)
		button.tt-next(ref="nextButton" @click="emit('next')") Next
</template>

<script setup>
import {onMounted, ref} from 'vue';
import SvgIcon from '../svg-icon/svg-icon.vue';
import TutorialPopup from '../tutorial-popup/tutorial-popup.vue';

const emit = defineEmits(['next']);

const nextButton = ref(null);

onMounted(() => {
	nextButton.value?.focus();
});
</script>

<style scoped>
.tt-body-content {
	margin-top: 16px;
}

.tt-next {
	background-color: var(--color-gray-ff);
	border: 1px solid var(--color-base);
	border-radius: 6px;
	color: var(--color-base);
	cursor: pointer;
	margin: auto 0 0 auto;
	padding: 8px;
}

.tt-next:focus {
	outline: 1px solid var(--color-base);
}

.tt-icon {
	width: 18px;
}
</style>

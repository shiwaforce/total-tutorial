<template lang="pug">
tutorial-popup
	template(#header) Pick an element
	template(#body)
		p.tt-body-content Now, step by step, we can set the content of your visitors will see.
		|  You don't need any programming knowledge, just move your mouse over your site!
		p.tt-body-content  You can now select an item on your page by simple click.
		p.tt-body-content  The selection consists of two steps:
		p.tt-body-content  1. Select an element by clicking on it.
		p.tt-body-content  2. fine-tune the selection using a slider.
		p.tt-body-content  During the selection process, a so-called CSS selector is defined.
		|  If you have no knowledge of sitebuild, feel free to rely on your eye. The result will be visually excellent.
		p.tt-body-content If you do have sitebuild knowledge, you can track the evolution of the selected selector
		| when selecting the parent so you can refine the semantics of the selection, which may or may not be visually different.
	template(#footer)
		label.tt-dont-show-again(for="dontShowAgain")
			input#dontShowAgain(v-model="dontShowAgain", type="checkbox")
			span Don't show again
		button.tt-next(ref="nextButton" @click="emit('start-pick', dontShowAgain)") Next
</template>

<script setup>
import {onMounted, ref} from 'vue';
import TutorialPopup from '../tutorial-popup/tutorial-popup.vue';

const emit = defineEmits(['start-pick']);

const nextButton = ref(null);
const dontShowAgain = ref(false);

onMounted(() => {
	nextButton.value?.focus();
});
</script>


<style scoped>
.tt-body-content {
	margin-top: 12px;
}

.tt-body-content:last-of-type {
	margin-bottom: 12px;
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

.tt-dont-show-again {
	align-items: center;
	cursor: pointer;
	display: flex;
}

.tt-dont-show-again input {
	margin: -5px 8px 0 0;
}
</style>

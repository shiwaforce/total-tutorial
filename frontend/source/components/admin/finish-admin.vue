<template lang="pug">
tutorial-popup
	template(#header) The wizard says goodbye
	template(#body)
		p.tt-body-content Click on the save button below to start the config download. You can use this for a tutorial embedded in your website.
		p.tt-body-content Make sure you include the following code in the source of your website:
		p.tt-body-code-example &lt;script src="/total-tutorial.js?config=/config.json"&gt;&lt;/script&gt;
		p.tt-body-content Also make sure that the config.json referenced by the above script is available from your website.
	template(#footer)
		button.tt-exit(@click="emit('exit')") Exit
		button.tt-next(ref="saveButton" @click="downloadTheConfig") Save
</template>

<script setup>
import download from '../../utils/download';
import {ref} from 'vue';
import TutorialPopup from '../tutorial-popup/tutorial-popup.vue';

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['exit']);

const nextButton = ref(null);

function downloadTheConfig() {
	download('config.json', JSON.stringify(props.config), 'application/json');
}

setTimeout(() => {
	nextButton.value?.focus();
});

</script>

<style scoped>
.tt-body-content {
	margin-top: 16px;
}

.tt-exit, .tt-next {
	background-color: var(--color-gray-ff);
	border: 1px solid var(--color-base);
	border-radius: 6px;
	color: var(--color-base);
	cursor: pointer;
	padding: 8px;
}

.tt-next {
	margin: auto 0 0 auto;
}

.tt-next:focus {
	outline: 1px solid var(--color-base);
}

.tt-body-code-example {
	background: #555;
	color: var(--background-color);
	font-family: monospace;
	margin-top: 16px;
}
</style>

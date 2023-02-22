<template lang="pug">
.tt-container(@click="makeEditable" @focusout="saveEdit")
	.tt-content(v-if="isEditing || field" ref="content" :contenteditable="isEditing" @input="handleInput")
	.tt-placeholder(v-else) {{ placeholder }}
</template>

<script setup>
import constants from '../../utils/constants';
import DOMPurify from 'dompurify';
import {onMounted, ref, watch} from 'vue';

const props = defineProps({
	field: {
		type: String,
		required: true
	},
	placeholder: {
		type: String,
		default: 'Click here to edit...'
	},
	stepIndex: {
		type: Number,
		default: 0
	}
});

const emit = defineEmits(['change']);

const isEditing = ref(false);
const content = ref(null);

const updateContentValue = () => {
	if (props.field !== '' && content.value) {
		content.value.innerHTML = DOMPurify.sanitize(props.field, {
			ALLOWED_TAGS: constants.ALLOWED_HTML_TAGS
		});
	}
};

watch(() => props.stepIndex, () => {
	updateContentValue();
});

onMounted(() => {
	updateContentValue();
});

function makeEditable(clickEvent) {
	isEditing.value = true;
	const container = clickEvent.target.closest('.tt-container');
	setTimeout(() => {
		const contentElement = container.querySelector('.tt-content');
		contentElement.focus();
	});
}

function handleInput() {
	emit('change', content.value.innerHTML);
}

function saveEdit(focusEvent) {
	const container = focusEvent.target.closest('.tt-container');
	const contentElement = container.querySelector('.tt-content');
	emit('change', contentElement.innerHTML);
	isEditing.value = false;
}

</script>

<style scoped>
.tt-container {
	background: transparent;
}

.tt-content {
	background: transparent;
	color: inherit;
	font-size: inherit;
	min-height: 1em;
}

.tt-placeholder {
	background: transparent;
	color: var(--color-gray-d9);
	font-size: inherit;
	font-style: italic;
}
</style>

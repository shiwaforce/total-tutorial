<template lang="pug">
holed-layer(:config="config")
	exit-button(@exit-tutorial="onExitTutorial")
	h1.tt-current-step-title(v-if="currentComputedStep.title" v-html="currentComputedStep.title")
	.tt-container
		p.tt-current-step-description(v-if="currentComputedStep.description" v-html="currentComputedStep.description")
		.tt-video-container
			video-box(v-if="currentComputedStep.videoUrl" :video-url="currentComputedStep.videoUrl")
		.tt-image-container
			image-box(v-if="currentComputedStep.imageUrl" :image-url="currentComputedStep.imageUrl")
	.tt-navigate-buttons-container(:class="{'tt-justify-content-right': config.currentStep <= 0}")
		navigate-buttons(:config="props.config" @finish-tutorial="onFinishTutorial" @navigate-to-step="onNavigateToStep" @step-to-index="onStepToIndex($event)")
</template>

<script setup>
import {computed} from 'vue';
import constants from '../../utils/constants';
import DOMPurify from 'dompurify';
import ExitButton from '../exit-button/exit-button.vue';
import HoledLayer from '../holed-layer/holed-layer.vue';
import ImageBox from '../image-box/image-box.vue';
import NavigateButtons from '../navigate-buttons/navigate-buttons.vue';
import removeTutorialCssClasses from '../../utils/remove-tutorial-css-classes';
import {useStore} from '../../store/use-store';
import VideoBox from '../video-box/video-box.vue';

const store = useStore();
const emit = defineEmits(['exit-tutorial', 'finish-tutorial']);

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const currentComputedStep = computed(() => {
	const {steps, currentStep} = props.config;
	const {title, description} = steps[currentStep];

	const sanitizedTitle = DOMPurify.sanitize(title, {
		ALLOWED_TAGS: constants.ALLOWED_HTML_TAGS
	});
	const sanitizedDescription = DOMPurify.sanitize(description, {
		ALLOWED_TAGS: constants.ALLOWED_HTML_TAGS
	});

	return {
		...steps[currentStep],
		title: sanitizedTitle,
		description: sanitizedDescription
	};
});

const onNavigateToStep = direction => {
	removeTutorialCssClasses();
}
const onStepToIndex = index => {
	removeTutorialCssClasses();
	store.stepToIndex(index);
};

const onExitTutorial = () => {
	removeTutorialCssClasses();
	emit('exit-tutorial');
};

const onFinishTutorial = () => {
	removeTutorialCssClasses();
	emit('finish-tutorial');
};
</script>

<style scoped>
.tt-container {
	display: flex;
	flex-grow: 1;
	flex-flow: column;
	overflow: auto;
	padding: 8px 8px 8px 0;
	width: 100%;
}

.tt-current-step-title {
	color: var(--color-base);
	font-size: 20px;
	margin: 0;
}

.tt-current-step-title:before { /* placeholder for the close button */
	content: '';
	display: block;
	float: right;
	height: 28px;
	width: 28px;
}

.tt-current-step-description {
	color: var(--color-normal);
	flex-grow: 1;
}

.tt-navigate-buttons-container {
	border-top: 1px solid var(--color-gray-d9);
	display: flex;
	justify-content: space-between;
	margin: -1px 0;
	padding: 8px 8px 1px 0;
}

.tt-justify-content-right {
	justify-content: right;
}

.tt-progress-container {
	align-items: center;
	display: flex;
	justify-content: center;
}

.tt-video-container,
.tt-image-container {
	max-width: 100%;
}
</style>

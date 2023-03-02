<template lang="pug">
step-box(
	v-if="config?.steps?.length && !isTutorialClosed && !isTutorialFinished && hasAllElementsLoaded"
	:config="config"
	@exit-tutorial="onExitTutorial"
	@finish-tutorial="onFinishTutorial"
)
.tt-display-none {{ hasAllElementsLoaded }}
</template>

<script setup>
import constants from '../../utils/constants';
import {inject, nextTick, onBeforeUnmount, onMounted, ref} from 'vue';
import loadStateFromLocalStorage from '../../utils/state/load-state-from-local-storage';
import onPathChange from '../../utils/on-path-change';
import saveStateToLocalStorage from '../../utils/state/save-state-to-local-storage';
import StepBox from '../step-box/step-box.vue';
import {useStore} from '../../store/use-store';

const rootId = inject(constants.ROOT_ID);
const isTutorialClosed = ref(false);
const isTutorialFinished = ref(false);
const hasAllElementsLoaded = ref(false);

const store = useStore();

let config = store.configForCurrentUrl();

const stepSelectorPresent = step => document.querySelector(step.selector) || !step.selector;
const observer = new MutationObserver(() => {
	const loaded = config?.steps?.length && config?.steps.every(stepSelectorPresent);
	if (!loaded) {
		console.info('total tutorial waits for selector(s)', config?.steps?.filter(step => step.selector && !document.querySelector(step.selector)).map(step => step.selector));
	}
	if (loaded) {
		setTimeout(() => { // when loaded, try to access later again
			hasAllElementsLoaded.value = config?.steps?.every(stepSelectorPresent);
		});
	}
});

onMounted(() => {
	try {
		const state = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_KEY))?.[window.location.pathname];
		isTutorialClosed.value = state?.isClosed;
		isTutorialFinished.value = state?.isFinished;
	} catch (error) {
		console.warn('Couldn\'t get local storage', error, isTutorialClosed, isTutorialFinished);
		isTutorialClosed.value = false;
		isTutorialFinished.value = false;
	}
	onPathChange(() => {
		config = store.configForCurrentUrl();
		hasAllElementsLoaded.value = config?.steps?.every(step => document.querySelector(step.selector) || !step.selector);
	});
	observer.observe(document.body, {attributes: true, childList: true, subtree: true});
	const initStatic = inject(`$${constants.INIT_STATIC}`);
	if (!localStorage.getItem(`${constants.APP_NAME}-${constants.INIT_STATIC}`)) {
		initStatic();
	}
});

onBeforeUnmount(() => {
	observer.disconnect();
});

function sendDomEvent(eventName, detail = {}) {
	const rootElement = document.getElementById(rootId);
	rootElement?.dispatchEvent(new CustomEvent(eventName, {
		bubbles: true,
		detail
	}));
}

const updateTutorialState = (actionType) => {
	const currentPathname = window.location.pathname;
	const state = loadStateFromLocalStorage();
	const tutorialState = state[currentPathname] || {steps: []};
	tutorialState[actionType] = true;
	state[currentPathname] = tutorialState;
	saveStateToLocalStorage(state);
	sendDomEvent(`total-tutorial-${actionType}`, {step: config.currentStep});
};

const onExitTutorial = () => {
	isTutorialClosed.value = true;
	updateTutorialState('exit');
};

const onFinishTutorial = () => {
	isTutorialFinished.value = true;
	updateTutorialState('finish');
};
</script>

<style scoped>
.tt-display-none {
	display: none;
}
</style>

import createEmptyState from './create-empty-state';
import loadStateFromLocalStorage from './load-state-from-local-storage';
import saveStateToLocalStorage from './save-state-to-local-storage';

/**
 * Loads and saves the current step of a multistep process to local storage.
 * @param {object} config - A configuration object that maps a step path to its current step.
 * @returns {void}
 */
export default function loadAndSaveSteps(config) {
	const state = loadStateFromLocalStorage();
	Object.keys(config).forEach(path => {
		if (!state[path]) {
			state[path] = createEmptyState();
		}
		state[path].currentStep = config[path].currentStep;
	});
	saveStateToLocalStorage(state);
}

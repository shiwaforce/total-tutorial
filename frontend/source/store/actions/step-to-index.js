import loadAndSaveSteps from '../../utils/state/load-and-save-steps';

/**
 * make a step in tutorial to given step
 * @param stepIndex {number} positive number indicates the index of the step
 * @author varga.gyorgy.mark
 */
export default function stepToIndex(stepIndex) {
	const currentPath = location.pathname;
	const maxStep = this.config[currentPath].steps.length;
	console.assert(
		stepIndex < maxStep && stepIndex >= 0, 'step index should be between 0 and ' + maxStep
	);
	this.config[currentPath].currentStep = stepIndex;
	loadAndSaveSteps(this.config);
}

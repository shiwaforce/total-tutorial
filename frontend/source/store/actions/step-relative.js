import loadAndSaveSteps from '../../utils/state/load-and-save-steps';

/**
 * make a step in tutorial of current path
 * @param stepDirection {integer} positive number indicates to forward, negative to backward
 * @author sarkiroka
 */
export default function stepRelative(stepDirection) {
	console.assert(stepDirection != 0, 'direction should not be zero');
	const stepDifference = Math.sign(stepDirection);
	const currentPath = location.pathname;
	const maxStep = this.config[currentPath].steps.length;
	let currentStep = this.config[currentPath].currentStep + stepDifference;
	currentStep = Math.min(maxStep, Math.max(0, currentStep));
	this.config[currentPath].currentStep = currentStep;
	loadAndSaveSteps(this.config);
}

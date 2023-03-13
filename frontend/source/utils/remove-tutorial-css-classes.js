/**
 * Removes css selectors used for tutorial element selection, element highlighting
 * @author sarkiroka
 */
export default () => {
	const CURRENT_ELEMENT_CLASSNAME = 'tt-current-element';
	const CURRENT_PARENTS_CLASSNAME = 'tt-current-parents';
	const affectedElements = Array.from(document.querySelectorAll(`.${CURRENT_PARENTS_CLASSNAME},.${CURRENT_ELEMENT_CLASSNAME}`));
	affectedElements.forEach(affectedElement => {
		affectedElement.classList.remove(`${CURRENT_PARENTS_CLASSNAME}}`, `${CURRENT_ELEMENT_CLASSNAME}`);
	});
};

import constants from './constants';

const notAllowedClasses = [constants.CURRENT_ELEMENT_CLASSNAME, constants.CURRENT_PARENTS_CLASSNAME];
/**
 * returns the CSS3 selector of the DOM element given in the parameter, which can be used to explicitly capture the element
 * @param domElement {domElement} the dom element we are looking for the selector of
 * @returns {string} css3 selector
 * @author sarkiroka
 */
export default function getCssSelector(domElement) {
	if (!(domElement instanceof Element)) {
		return '';
	}

	const path = [];
	while (domElement.nodeType === Node.ELEMENT_NODE && domElement.parentElement) {
		const nodeName = domElement.nodeName.toLowerCase();
		let selector = nodeName;

		const idOfElement = domElement.getAttribute('id');
		const parentElement = domElement.parentElement;

		const elementsWithId = document.querySelectorAll(`#${idOfElement}`);
		if (idOfElement && elementsWithId.length == 1) {
			selector += `#${idOfElement}`;
			path.unshift(selector);
			break;
		} else {
			const classes = Array.from(domElement.classList).filter(cssClass => !notAllowedClasses.includes(cssClass));
			const hasClasses = classes.length > 0;
			const classesSelector = hasClasses ? `.${classes.join('.')}` : '';
			selector += classesSelector;

			if (!hasClasses || parentElement.querySelectorAll(`:scope > ${classesSelector}`).length != 1) {
				const numberOfType = parentElement.querySelectorAll(`:scope > ${selector}`).length;
				let countOfPreviousSiblings = 1;
				let sibling = domElement;

				while (sibling.previousElementSibling && path.length <= 3 && sibling.nodeName.toLowerCase() == nodeName) {
					sibling = sibling.previousElementSibling;
					countOfPreviousSiblings++;
				}

				if (numberOfType != 1) {
					selector += `:nth-of-type(${countOfPreviousSiblings})`;
				}
			}
		}

		path.unshift(selector);
		domElement = domElement.parentNode;
	}

	return path.join(' > ');
}

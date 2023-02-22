import constants from '../constants';
import createEmptyState from './create-empty-state';
import saveStateToLocalStorage from './save-state-to-local-storage';
import usefulJsonParse from '../useful-json-parse';

/**
 * loads state from localStorage
 * @returns {state}
 * @author sarkiroka
 */
export default function loadStateFromLocalStorage() {
	let localStorageValue = null;
	try {
		localStorageValue = usefulJsonParse(localStorage.getItem(constants.LOCAL_STORAGE_KEY));
	} catch (parseError) {
		console.warn('cannot parse localstorage state');
	}
	if (!localStorageValue) {
		localStorageValue = createEmptyState();
		saveStateToLocalStorage(localStorageValue);
	}
	return localStorageValue;
}

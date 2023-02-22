import constants from '../constants';
import createEmptyState from './create-empty-state';

/**
 * saves current state into localStorage
 * @param state
 * @author sarkiroka
 */
export default function saveStateToLocalStorage(state) {
	try {
		localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(state));
	} catch (serializeError) {
		console.warn('cannot serialize state', serializeError);
		localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(createEmptyState()));
	}
}

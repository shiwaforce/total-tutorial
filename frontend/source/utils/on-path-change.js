let originalPathname = location.pathname;

const subscribers = [];
setInterval(() => {
	const currentPath = location.pathname;
	if (currentPath != originalPathname) {
		subscribers.forEach(subscriber => {
			try {
				subscriber(currentPath, originalPathname);
			} catch (error) {
				console.error('could not notify the subscriber of the event', error, subscriber.toString());
			}
		});
		originalPathname = currentPath;
	}
}, 250);

/**
 * A function that registers a callback to be called when the URL path changes.
 * @param {function} callback - A function to be called when the URL path changes.
 * @returns {void}
 */
export default function onPathChange(callback) {
	console.assert(typeof callback == 'function', 'callback must be a function', callback);
	subscribers.push(callback);
}

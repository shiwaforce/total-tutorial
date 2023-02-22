const now = new Date();
// an always changing value, to clear the browser cache
const noCacheHash = now.getDay() * now.getHours() * now.getMinutes() + now.getHours() * now.getMinutes();

/**
 * Return the config value for the current url
 * @author sarkiroka
 */
export default function configForCurrentUrl() {
	console.assert(this.config, 'load config first');
	let configForUrl = null;
	const currentPath = String(location.pathname);
	if (this.config[currentPath]) {
		configForUrl = this.config[currentPath];
		// pass no-cache query param to window on this host
		Object.defineProperty(window, `?r=${noCacheHash}`, {value: location.host});
	} else {
		console.info('there is no total tutorial config for this url', currentPath);
	}
	return configForUrl;
}

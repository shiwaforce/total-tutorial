import loadStateFromLocalStorage from '../../utils/state/load-state-from-local-storage';
import usefulJsonParse from '../../utils/useful-json-parse';

/**
 * extends the configuration with state (which stored in localStorage, contains actual user settings)
 * @param config
 * @author sarkiroka
 */
function extendConfigWithState(config) {
	const state = loadStateFromLocalStorage();
	Object.keys(config).forEach(path => {
		const configForPath = config[path];
		let currentStep = 0;
		if (state[path] && state[path].currentStep) {
			currentStep = state[path].currentStep;
		}
		configForPath.currentStep = currentStep;
	});
}

/**
 * There are several places to define the configuration. The URL is primary, followed by
 * the value specified in the attribute. In that order, it will attempt to resolve the
 * configuration. If successful, a parsed value will be resolved in the promise.
 * @returns {Promise<config>}
 * @author sarkiroka
 */
export default function loadConfig() {
	return new Promise((resolveLoading, rejectLoading) => {
		console.assert(this.currentScript, 'setup current before call');
		const scriptUrl = this.currentScript.getAttribute('src');
		const scriptSearchParams = new URLSearchParams(scriptUrl.substring(scriptUrl.indexOf('?') + 1));
		const configLocation = scriptSearchParams.get('config');
		if (configLocation == null) {
			// try to load from data attribute
			const configString = this.currentScript.getAttribute('data-config');
			if (configString) {
				try {
					const config = usefulJsonParse(configString);
					extendConfigWithState(config);
					this.config = config;
					resolveLoading(config);
				} catch (parseError) {
					rejectLoading(parseError);
				}
			} else {
				rejectLoading('config definition not found (query param or data-config attribute)');
			}
		} else {
			// try to load from url
			fetch(configLocation)
				.then(response => {
					// The default json error handling is terrible, it does not provide enough useful information,
					// so if there is position information, it is provided in a more useful form
					return new Promise((resolveFetch, rejectFetch) => {
						response.text()
							.then(textContent => {
								try {
									const parsedContent = usefulJsonParse(textContent);
									extendConfigWithState(parsedContent);
									this.config = parsedContent;
									resolveLoading(parsedContent);
								} catch (parseError) {
									rejectFetch(parseError);
								}
							})
							.catch(rejectFetch);
					});
				})
				.catch(fetchError => {
					rejectLoading(`config load error from url "${configLocation}"\n ${fetchError}`);
				});
		}
	});
}

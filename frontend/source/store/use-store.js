import configForCurrentUrl from './getters/config-for-current-url';
import {defineStore} from 'pinia';
import loadConfig from './actions/load-config';
import setScript from './actions/set-script';
import stepRelative from './actions/step-relative';
import stepToIndex from './actions/step-to-index';

export const useStore = defineStore('main', {
	state: () => ({
		currentScript: null,
		config: null
	}),
	actions: {
		setScript,
		loadConfig,
		stepRelative,
		stepToIndex,
		configForCurrentUrl
	}
});

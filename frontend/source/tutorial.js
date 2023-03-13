/**
 * this is the main entry point of tutorial.js
 * first of all waits all of necessary resource, and after them loads
 * create a div element with unique id, and mount the application into div
 * @author sarkiroka
 */
import boot from './utils/boot';
import constants from './utils/constants';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import root from './components/root/root.vue';
import {useStore} from './store/use-store';

const app = createApp(root);
app.use(createPinia());
const store = useStore();
store.setScript(document.currentScript);
const configLoaded = store.loadConfig();
document.addEventListener('total-tutorial-restart', () => {
	localStorage.removeItem(`${constants.APP_NAME}_${constants.INIT_STATIC}`);
	localStorage.removeItem(`${constants.LOCAL_STORAGE_KEY}`);
	boot(app, configLoaded);
});

boot(app, configLoaded);

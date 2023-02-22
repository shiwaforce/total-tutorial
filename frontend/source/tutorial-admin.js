/**
 * Some people may find it difficult to parameterise the configuration json.
 * For them, the admin function can help, where they can interactively edit
 * and save the json configuring tutorial.js in a wyswyg way.
 * @author sarkiroka
 */
import boot from './utils/boot';
import {createApp} from 'vue';
import root from './components/admin/admin.vue';

const app = createApp(root);

boot(app);

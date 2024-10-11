import { createApp } from 'vue';

import RootVue from './Root.vue';

import { router } from './Router';

// import E from 'eruda';

// E.init({ tool: ['console'] });

import { Renderer } from './Plugins/Renderer';
await Renderer.Run();

createApp(RootVue).use(router).mount('#App');

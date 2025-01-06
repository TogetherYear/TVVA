import { TRouter } from '@/Decorators/TRouter';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: TRouter.routes
});

router.beforeEach((to, form) => {
    TRouter.BeforeRouteHandler(to, form);
});

router.afterEach((to, from) => {
    TRouter.AfterRouteHandler(to, from);
});

export { router };

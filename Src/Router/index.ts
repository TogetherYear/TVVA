import { TRouter } from '@/Decorators/TRouter';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: TRouter.routes
});

router.afterEach((to, from) => {
    TRouter.RefreshRoute(to, from);
});

TRouter.InitMenu(router.getRoutes());

export { router };

import { Component } from '@/Libs/Component';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router';

namespace TRouter {
    /**
     * 路由菜单
     */
    export const routes: Array<RouteRecordRaw & { meta?: ViewMeta }> = [
        {
            path: '/',
            name: 'Default',
            redirect: '/Application'
        },
        {
            path: '/:pathMatch(.*)',
            name: '404',
            redirect: '/Empty'
        },
        {
            path: '/Empty',
            name: 'Empty',
            meta: {
                menuName: '404',
                menuLabel: '404',
                menuIcon: '',
                visibility: false
            },
            component: () => import('@/Views/Empty/Empty.vue')
        },
        {
            path: '/Application',
            name: 'Application',
            meta: {
                menuName: '应用',
                menuLabel: '应用',
                menuIcon: '',
                visibility: true
            },
            component: () => import('@/Views/Application/Application.vue')
        }
    ];

    //#region 模块

    export type ViewMeta = {
        /**
         * 后台对应字段
         */
        menuName: string;
        /**
         * 菜单显示字段
         */
        menuLabel: string;
        /**
         * 菜单图标
         */
        menuIcon: string;
        /**
         * 是否在菜单显示
         */
        visibility: boolean;
    };

    /**
     * 当前活动页面 自己后续增加层级
     */
    export const activeView = reactive<{ _1: string; _2: string; _3: string }>({ _1: '', _2: '', _3: '' });

    //#endregion

    //#region 工具

    /**
     * 上一次路由
     */
    export const lastPath = ref<string>('');

    /**
     * 当前路由
     */
    export const currentPath = ref<string>('');

    /**
     * 当前页面路由参数
     */
    export let currentQuery!: Record<string, unknown>;

    /**
     * 路由历史
     */
    export const routeHistory = ref<Array<{ path: string; query: Record<string, string> }>>([]);

    /**
     * 系统资源是否加载完毕可以显示第一个页面
     */
    let isLoad = false;

    export const requestAbort: Array<AbortController> = [];

    export function BeforeRouteHandler(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
        RequestCancelHandler();
    }

    function RequestCancelHandler() {
        if (isLoad) {
            for (let ra of requestAbort) {
                if (!ra.signal.aborted) {
                    ra.abort();
                }
            }
            requestAbort.splice(0, requestAbort.length);
        }
    }

    export function AfterRouteHandler(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
        HistoryAndQueryHandler(to, from);
    }

    function HistoryAndQueryHandler(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
        lastPath.value = from.path;
        currentPath.value = to.path;
        const index = routeHistory.value.findIndex((r) => r.path === to.path);
        if (index !== -1) {
            routeHistory.value.splice(index, 1);
        }
        routeHistory.value.push({ path: to.path, query: { ...to.query } as Record<string, string> });
        if (Object.keys(to.meta).length !== 0) {
            //@ts-ignore
            activeView._1 = to.matched[0]?.meta.menuName;
            //@ts-ignore
            activeView._2 = to.matched[1]?.meta.menuName;
            //@ts-ignore
            activeView._3 = to.matched[2]?.meta.menuName;
        }
        currentQuery = { ...to.query };
    }

    /**
     * 路由生成
     */
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TRouter_Generate_Hooks();
                }

                private TRouter_Generate_Hooks() {
                    onMounted(() => {
                        this.TRouter_Generate_EmitFrom();
                        this.TRouter_Generate_Loading();
                    });

                    onUnmounted(() => {
                        this.TRouter_Generate_EmitTo();
                    });
                }

                private TRouter_Generate_EmitFrom() {
                    //@ts-ignore
                    const from = (this['tRouter_From_NeedCreate'] || []) as Array<{ funcName: string; from: string | ((instance: T) => string) }>;
                    for (let f of from) {
                        //@ts-ignore
                        if (lastPath.value.indexOf(typeof f.from === 'function' ? f.from(this) : f.from) !== -1) {
                            //@ts-ignore
                            this[`${f.funcName}`]();
                        }
                    }
                }

                private TRouter_Generate_EmitTo() {
                    //@ts-ignore
                    const to = (this['tRouter_To_NeedCreate'] || []) as Array<{ funcName: string; to: string | ((instance: T) => string) }>;
                    for (let t of to) {
                        //@ts-ignore
                        if (currentPath.value.indexOf(typeof t.to === 'function' ? t.to(this) : t.to) !== -1) {
                            //@ts-ignore
                            this[`${t.funcName}`]();
                        }
                    }
                }

                private TRouter_Generate_Loading() {
                    if (!isLoad) {
                        isLoad = true;
                        //@ts-ignore
                        window.HideLoading();
                    }
                }
            };
        };
    }

    /**
     * 如果从 from 路由进来 会触发的函数 我会进行匹配 只要传入参数被包含在路由中 触发函数不支持传参 ( from 为 '/' 即只要进来就会触发)
     */
    export function WhenFrom<T extends Component>(from: string | ((instance: T) => string)) {
        return function (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tRouter_From_NeedCreate']) {
                //@ts-ignore
                target['tRouter_From_NeedCreate'].push({
                    funcName: propertyKey,
                    from
                });
            } else {
                //@ts-ignore
                target['tRouter_From_NeedCreate'] = [
                    {
                        funcName: propertyKey,
                        from
                    }
                ];
            }
        };
    }

    /**
     * 如果进入 to 路由 会触发的函数 我会进行匹配 只要传入参数被包含在路由中 触发函数不支持传参 ( To 为 '/' 即只要离开就会触发)
     */
    export function WhenTo<T extends Component>(to: string | ((instance: T) => string)) {
        return function (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tRouter_To_NeedCreate']) {
                //@ts-ignore
                target['tRouter_To_NeedCreate'].push({
                    funcName: propertyKey,
                    to
                });
            } else {
                //@ts-ignore
                target['tRouter_To_NeedCreate'] = [
                    {
                        funcName: propertyKey,
                        to
                    }
                ];
            }
        };
    }

    //#endregion
}

export { TRouter };

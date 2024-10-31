import { Mathf } from '@/Utils/Mathf';
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Resolve } from './index';
import { TEvent } from './TEvent';
import { Entity } from '@/Libs/Entity';
import { Time } from '@/Utils/Time';

namespace TTool {
    /**
     * 防抖列表
     */
    const debounceMap = new Map<string, number>();

    /**
     * 节流列表
     */
    const throttleMap = new Map<string, number>();

    /**
     * 缓存列表
     */
    const cacheMap = new Map<string, Array<{ key: string; value: unknown }>>();

    /**
     * 工具生成
     */
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Entity>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TTool_Generate_Debounce();
                    this.TTool_Generate_Throttle();
                    this.TTool_Generaye_Retry();
                    this.TTool_Generate_MountRange();
                    this.TTool_Generate_MountLength();
                    this.TTool_Generate_MountWatch();
                    //@ts-ignore
                    if (this['tEvent_Generate_Type'] === TEvent.Lifecycle.Temporary) {
                        this.TTool_Generate_Hooks();
                    } else {
                        this.TTool_Generate_Interval();
                    }
                }

                private tTool_Generate_Range: Array<() => void> = [];

                private tTool_Generate_Length: Array<() => void> = [];

                private tTool_Generate_Watch: Array<() => void> = [];

                private tTool_Generate_Interval: Array<number> = [];

                private tTool_Generate_Observers = new Map<HTMLElement, IntersectionObserver>();

                private TTool_Generate_Debounce() {
                    //@ts-ignore
                    const create = (this['tTool_Debounce_NeedCreate'] || []) as Array<{
                        funcName: string;
                        delta: number | ((instance: Object) => number);
                    }>;
                    for (let e of create) {
                        //@ts-ignore
                        const original = this[`${e.funcName}`].bind(this);
                        //@ts-ignore
                        this[`${e.funcName}`] = function (...args: Array<unknown>) {
                            //@ts-ignore
                            const key = `${this.unique_Id}:${e.funcName}`;
                            let timer = debounceMap.get(key);
                            if (timer) {
                                clearTimeout(timer);
                                //@ts-ignore
                                timer = setTimeout(
                                    () => {
                                        original(...args);
                                        debounceMap.delete(key);
                                    },
                                    typeof e.delta === 'function' ? e.delta(this) : e.delta
                                );
                            } else {
                                //@ts-ignore
                                timer = setTimeout(
                                    () => {
                                        original(...args);
                                        debounceMap.delete(key);
                                    },
                                    typeof e.delta === 'function' ? e.delta(this) : e.delta
                                );
                            }
                            //@ts-ignore
                            debounceMap.set(key, timer);
                        };
                    }
                }

                private TTool_Generate_Throttle() {
                    //@ts-ignore
                    const create = (this['tTool_Throttle_NeedCreate'] || []) as Array<{
                        funcName: string;
                        delta: number | ((instance: Object) => number);
                    }>;
                    for (let e of create) {
                        //@ts-ignore
                        const original = this[`${e.funcName}`].bind(this);
                        //@ts-ignore
                        this[`${e.funcName}`] = function (...args: Array<unknown>) {
                            //@ts-ignore
                            const key = `${this.unique_Id}:${e.funcName}`;
                            let lastTime = throttleMap.get(key);
                            if (lastTime) {
                                const currentTime = Date.now();
                                if (currentTime - lastTime > (typeof e.delta === 'function' ? e.delta(this) : e.delta)) {
                                    lastTime = currentTime;
                                    original(...args);
                                }
                            } else {
                                lastTime = Date.now();
                                original(...args);
                            }
                            throttleMap.set(key, lastTime);
                        };
                    }
                }

                private TTool_Generaye_Retry() {
                    //@ts-ignore
                    const retry = (this['tTool_Retry_Need'] || []) as Array<{
                        retryCount: number | ((instance: Object) => number);
                        retryDelay: number | ((instance: Object) => number);
                        PassRetryCondition: (data: Record<string, unknown>) => boolean;
                        propertyKey: string;
                    }>;

                    for (let r of retry) {
                        //@ts-ignore
                        const original: (...args: Array<unknown>) => Promise<Record<string, unknown>> = this[`${r.propertyKey}`].bind(this);
                        const temp = (...args: Array<unknown>): Promise<{ type: 'Success' | 'Error'; data: Record<string, unknown> }> => {
                            return new Promise((resolve, reject) => {
                                original(...args)
                                    .then((res) => {
                                        resolve({ type: 'Success', data: res });
                                    })
                                    .catch((err) => {
                                        resolve({ type: 'Error', data: err });
                                    });
                            });
                        };

                        //@ts-ignore
                        this[`${r.propertyKey}`] = function (...args: Array<unknown>) {
                            return new Promise(async (resolve, reject) => {
                                const count = typeof r.retryCount === 'function' ? r.retryCount(this) : r.retryCount;
                                for (let i = 0; i < count; ++i) {
                                    const result = await temp(...args);
                                    if (i === count - 1) {
                                        result.type === 'Success' ? resolve(result.data) : reject(result.data);
                                        break;
                                    }
                                    if (result.type === 'Success' && r.PassRetryCondition(result.data)) {
                                        resolve(result.data);
                                        break;
                                    }
                                    await Time.Sleep(typeof r.retryDelay === 'function' ? r.retryDelay(this) : r.retryDelay);
                                }
                            });
                        };
                    }
                }

                private TTool_Generate_Interval() {
                    Resolve.then(() => {
                        //@ts-ignore
                        const interval = (this['tTool_Interval_Need'] || []) as Array<{
                            propertyKey: string;
                            condition: boolean | ((instance: Object) => boolean);
                            time: number | ((instance: Object) => number);
                        }>;

                        for (let i of interval) {
                            //@ts-ignore
                            const original = this[`${i.propertyKey}`].bind(this);

                            const timer = setInterval(
                                () => {
                                    if (typeof i.condition === 'function' ? i.condition(this) : i.condition) {
                                        original();
                                    }
                                },
                                typeof i.time === 'function' ? i.time(this) : i.time
                            );
                            //@ts-ignore
                            this.tTool_Generate_Interval.push(timer);

                            //@ts-ignore
                            this[`${i.propertyKey}`] = function (...args: Array<unknown>) {
                                original(...args);
                            };
                        }
                    });
                }

                private TTool_Generate_Hooks() {
                    onMounted(() => {
                        this.TTool_Generate_CreateListen();
                        this.TTool_Generate_Interval();
                    });

                    onUnmounted(() => {
                        this.TTool_Generate_UnMountRange();
                        this.TTool_Generate_UnMountLength();
                        this.TTool_Generate_UnMountWatch();
                        this.TTool_Generate_UnMountInterval();
                        this.TTool_Generate_DestroyListen();
                    });
                }

                private TTool_Generate_MountRange() {
                    Resolve.then(() => {
                        //@ts-ignore
                        const range = (this['tTool_Range_Need'] || []) as Array<{
                            propertyKey: string;
                            immediate: boolean;
                            min: number | ((instance: Object) => number);
                            max: number | ((instance: Object) => number);
                        }>;
                        for (let r of range) {
                            this.tTool_Generate_Range.push(
                                watch(
                                    //@ts-ignore
                                    this[`${r.propertyKey}`],
                                    (newValue) => {
                                        //@ts-ignore
                                        this[`${r.propertyKey}`].value = Mathf.Clamp(typeof r.min === 'function' ? r.min(this) : r.min, typeof r.max === 'function' ? r.max(this) : r.max, newValue);
                                    },
                                    { immediate: r.immediate }
                                )
                            );
                        }
                    });
                }

                private TTool_Generate_MountLength() {
                    Resolve.then(() => {
                        //@ts-ignore
                        const length = (this['tTool_Length_Need'] || []) as Array<{ propertyKey: string; immediate: boolean; length: number | ((instance: Object) => number) }>;
                        for (let l of length) {
                            this.tTool_Generate_Length.push(
                                watch(
                                    //@ts-ignore
                                    this[`${l.propertyKey}`],
                                    (newValue: string) => {
                                        //@ts-ignore
                                        this[`${l.propertyKey}`].value = newValue.slice(0, typeof l.length === 'function' ? l.length(this) : l.length);
                                    },
                                    { immediate: l.immediate }
                                )
                            );
                        }
                    });
                }

                private TTool_Generate_MountWatch() {
                    Resolve.then(() => {
                        //@ts-ignore
                        const needWatch = (this['tTool_Watch_Need'] || []) as Array<{
                            Callback: (instance: Object, newValue: unknown, oldValue: unknown) => void;
                            deep: boolean;
                            immediate: boolean;
                            propertyKey: string;
                        }>;
                        for (let w of needWatch) {
                            this.tTool_Generate_Watch.push(
                                watch(
                                    //@ts-ignore
                                    this[`${w.propertyKey}`],
                                    (newValue, oldValue) => {
                                        w.Callback(this, newValue, oldValue);
                                    },
                                    { deep: w.deep, immediate: w.immediate }
                                )
                            );
                        }
                    });
                }

                private TTool_Generate_UnMountRange() {
                    for (let StopHandle of this.tTool_Generate_Range) {
                        StopHandle();
                    }
                }

                private TTool_Generate_UnMountLength() {
                    for (let StopHandle of this.tTool_Generate_Length) {
                        StopHandle();
                    }
                }

                private TTool_Generate_UnMountWatch() {
                    for (let StopHandle of this.tTool_Generate_Watch) {
                        StopHandle();
                    }
                }

                private TTool_Generate_UnMountInterval() {
                    for (let i of this.tTool_Generate_Interval) {
                        clearInterval(i);
                    }
                }

                private TTool_Generate_CreateListen() {
                    //@ts-ignore
                    const listen = (this['tTool_Observer_NeedListen'] || []) as Array<{
                        dom: HTMLElement | ((instance: Object) => HTMLElement);
                        funcName: string;
                        once: boolean;
                    }>;

                    for (let l of listen) {
                        const element = typeof l.dom === 'function' ? l.dom(this) : l.dom;
                        const observer = new IntersectionObserver((entries) => {
                            if (entries[0].intersectionRatio <= 0) {
                                //@ts-ignore
                                this[`${l.funcName}`](false);
                            } else {
                                //@ts-ignore
                                this[`${l.funcName}`](true);
                                if (l.once) {
                                    observer.disconnect();
                                    this.tTool_Generate_Observers.delete(element);
                                }
                            }
                        });
                        observer.observe(element);
                        this.tTool_Generate_Observers.set(element, observer);
                    }
                }

                private TTool_Generate_DestroyListen() {
                    for (let o of this.tTool_Generate_Observers) {
                        o[1].disconnect();
                    }
                    this.tTool_Generate_Observers.clear();
                }
            };
        };
    }

    /**
     * 防抖 默认 500 毫秒
     */
    export function Debounce<T extends Entity>(delta: number | ((instance: T) => number) = 500) {
        return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTool_Debounce_NeedCreate']) {
                //@ts-ignore
                target['tTool_Debounce_NeedCreate'].push({
                    funcName: propertyKey,
                    delta
                });
            } else {
                //@ts-ignore
                target['tTool_Debounce_NeedCreate'] = [
                    {
                        funcName: propertyKey,
                        delta
                    }
                ];
            }
        };
    }

    /**
     * 节流 默认 500 毫秒
     */
    export function Throttle<T extends Entity>(delta: number | ((instance: T) => number) = 500) {
        return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTool_Throttle_NeedCreate']) {
                //@ts-ignore
                target['tTool_Throttle_NeedCreate'].push({
                    funcName: propertyKey,
                    delta
                });
            } else {
                //@ts-ignore
                target['tTool_Throttle_NeedCreate'] = [
                    {
                        funcName: propertyKey,
                        delta
                    }
                ];
            }
        };
    }

    /**
     * 简单缓存页面 ( 此装饰器需要放在最下面 ) 参数为字符串
     */
    export function Cache<V>(needs: Array<keyof V>) {
        return function <T extends new (...args: Array<any>) => Entity>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.tTool_Cache_Need = needs;
                    this.TTool_Cache_Hooks();
                }

                private tTool_Cache_Key = '';

                private tTool_Cache_Need: Array<keyof V> = [];

                private TTool_Cache_Hooks() {
                    this.TTool_Cache_Get();

                    onUnmounted(() => {
                        this.TTool_Cache_Set();
                    });
                }

                private TTool_Cache_Get() {
                    const route = useRoute();
                    this.tTool_Cache_Key = `${route.path}:${C.name}`;
                    const current = cacheMap.get(this.tTool_Cache_Key);
                    if (current) {
                        for (let c of current) {
                            if (this.hasOwnProperty(c.key)) {
                                //@ts-ignore
                                this[`${c.key}`] = c.value;
                            }
                        }
                    }
                }

                private TTool_Cache_Set() {
                    const cache: Array<{ key: string; value: unknown }> = [];
                    for (let c of this.tTool_Cache_Need) {
                        if (this.hasOwnProperty(c)) {
                            cache.push({
                                key: c as string,
                                //@ts-ignore
                                value: this[`${c}`]
                            });
                        }
                    }
                    cacheMap.set(this.tTool_Cache_Key, cache);
                }
            };
        };
    }

    /**
     * Dom 观察 是否在视图可视区域内 被装饰器修饰的函数需要一个参数 为当前状态 ( Manager 用不了 因为它没有生命周期 只有 Component 有 最好只去监听用 ref 定义的 dom )
     */
    export function Observer<T extends Entity>(dom: HTMLElement | ((instance: T) => HTMLElement), once?: boolean) {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTool_Observer_NeedListen']) {
                //@ts-ignore
                target['tTool_Observer_NeedListen'].push({
                    dom,
                    funcName: propertyKey,
                    once: once || false
                });
            } else {
                //@ts-ignore
                target['tTool_Observer_NeedListen'] = [{ dom, funcName: propertyKey, once: once || false }];
            }
        };
    }

    /**
     * 限制变量范围 只支持 ref 定义的
     */
    export function LimitRange<T extends Entity>(min: number | ((instance: T) => number), max: number | ((instance: T) => number), immediate = true) {
        return function (target: Object, propertyKey: string | symbol) {
            //@ts-ignore
            if (target['tTool_Range_Need']) {
                //@ts-ignore
                target['tTool_Range_Need'].push({ propertyKey, min, max, immediate });
            } else {
                //@ts-ignore
                target['tTool_Range_Need'] = [{ propertyKey, min, max, immediate }];
            }
        };
    }

    /**
     * 限制字符串长度 只支持 ref 定义的
     */
    export function LimitLength<T extends Entity>(length: number | ((instance: T) => number), immediate = true) {
        return function (target: Object, propertyKey: string | symbol) {
            //@ts-ignore
            if (target['tTool_Length_Need']) {
                //@ts-ignore
                target['tTool_Length_Need'].push({ propertyKey, length, immediate });
            } else {
                //@ts-ignore
                target['tTool_Length_Need'] = [{ propertyKey, length, immediate }];
            }
        };
    }

    /**
     * 监听变量的变化 只接受 ref 和 reactive 定义的 ( T：当前类类型 K：变量类型 )
     */
    export function Watch<T extends Entity, K>(Callback: (instance: T, newValue: K, oldValue: K) => void, deep = false, immediate = false) {
        return function (target: Object, propertyKey: string | symbol) {
            //@ts-ignore
            if (target['tTool_Watch_Need']) {
                //@ts-ignore
                target['tTool_Watch_Need'].push({ Callback, deep, immediate, propertyKey });
            } else {
                //@ts-ignore
                target['tTool_Watch_Need'] = [{ Callback, deep, immediate, propertyKey }];
            }
        };
    }

    /**
     * 重复执行函数 必须是返回 Promise 的函数签名
     */
    export function Retry<T extends Entity>(
        retryCount: number | ((instance: T) => number),
        retryDelay: number | ((instance: T) => number),
        PassRetryCondition: (data: Record<string, unknown> | undefined | any) => boolean
    ) {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTool_Retry_Need']) {
                //@ts-ignore
                target['tTool_Retry_Need'].push({ retryCount, retryDelay, PassRetryCondition, propertyKey });
            } else {
                //@ts-ignore
                target['tTool_Retry_Need'] = [{ retryCount, retryDelay, PassRetryCondition, propertyKey }];
            }
        };
    }

    /**
     * 自动间隔时间重复执行 Manager 在构造函数完成的下一次事件循环执行 Component 在 onMounted 后的下一次事件循环执行
     * condition 是否执行的条件 time 每次执行间隔
     */
    export function Interval<T extends Entity>(condition: boolean | ((instance: T) => boolean), time: number | ((instance: T) => number)) {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTool_Interval_Need']) {
                //@ts-ignore
                target['tTool_Interval_Need'].push({ propertyKey, condition, time });
            } else {
                //@ts-ignore
                target['tTool_Interval_Need'] = [{ propertyKey, condition, time }];
            }
        };
    }
}
export { TTool };

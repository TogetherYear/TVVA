import { onUnmounted, ref, Ref, Reactive, reactive, toRaw } from 'vue';
import { TEvent } from './TEvent';
import { Resolve } from './index';
import { Entity } from '@/Libs/Entity';

namespace TTest {
    /**
     * 函数列表
     */
    export const functionMap = ref<Map<string, { label: string; scope: Object; funcName: string; args: Array<unknown> }>>(new Map());

    /**
     * 属性列表
     */
    export const propertyMap = ref<Map<string, { label: string; property: Ref<unknown> | Reactive<Record<string, unknown>> }>>(new Map());

    /**
     * 内存使用量
     */
    export const memory = reactive<{
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
    }>({ jsHeapSizeLimit: 0, totalJSHeapSize: 0, usedJSHeapSize: 0 });

    /**
     * 测试生成
     */
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Entity>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TTest_Generate_BindFunction();
                    this.TTest_Generate_BindProperty();
                    //@ts-ignore
                    if (this['tEvent_Generate_Type'] === TEvent.Lifecycle.Temporary) {
                        this.TTest_Generate_Hooks();
                    }
                }

                private TTest_Generate_BindFunction() {
                    //@ts-ignore
                    const bind = (this['tTest_Bind_Function'] || []) as Array<{
                        label: string;
                        funcName: string;
                        args: Array<unknown>;
                    }>;
                    for (let b of bind) {
                        //@ts-ignore
                        functionMap.value.set(`${this.unique_Id}:${b.funcName}`, {
                            label: b.label,
                            funcName: b.funcName,
                            args: b.args,
                            scope: this
                        });
                    }
                }

                private TTest_Generate_BindProperty() {
                    Resolve.then(() => {
                        //@ts-ignore
                        const bind = (this['tTest_Bind_Property'] || []) as Array<{
                            label: string;
                            propertyKey: string;
                        }>;
                        for (let b of bind) {
                            //@ts-ignore
                            propertyMap.value.set(`${this.unique_Id}:${b.propertyKey}`, {
                                label: b.label,
                                //@ts-ignore
                                property: this[`${b.propertyKey}`]
                            });
                        }
                    });
                }

                private TTest_Generate_Hooks() {
                    onUnmounted(() => {
                        this.TTest_Generate_UnBindFunction();
                        this.TTest_Generate_UnBindProperty();
                    });
                }

                private TTest_Generate_UnBindFunction() {
                    //@ts-ignore
                    const bind = (this['tTest_Bind_Function'] || []) as Array<{
                        label: string;
                        funcName: string;
                        args: Array<unknown>;
                    }>;
                    for (let b of bind) {
                        //@ts-ignore
                        functionMap.value.delete(`${this.unique_Id}:${b.funcName}`);
                    }
                }

                private TTest_Generate_UnBindProperty() {
                    //@ts-ignore
                    const bind = (this['tTest_Bind_Property'] || []) as Array<{
                        label: string;
                        propertyKey: string;
                    }>;
                    for (let b of bind) {
                        //@ts-ignore
                        propertyMap.value.delete(`${this.unique_Id}:${b.propertyKey}`);
                    }
                }
            };
        };
    }

    /**
     * 绑定测试函数 ...args 为需要传递的参数列表 如果需要传递类中变量 需要使用 函数 此函数只有一个参数 为 当前类实例 我会自动给你
     */
    export function BindFunction(label: string, ...args: Array<unknown>) {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tTest_Bind_Function']) {
                //@ts-ignore
                target['tTest_Bind_Function'].push({
                    label,
                    funcName: propertyKey,
                    args
                });
            } else {
                //@ts-ignore
                target['tTest_Bind_Function'] = [
                    {
                        label,
                        funcName: propertyKey,
                        args
                    }
                ];
            }
        };
    }

    /**
     * 绑定测试属性 只接受 ref 和 reactive 定义的
     */
    export function BindProperty(label: string) {
        return function (target: Object, propertyKey: string | symbol) {
            //@ts-ignore
            if (target['tTest_Bind_Property']) {
                //@ts-ignore
                target['tTest_Bind_Property'].push({
                    label,
                    propertyKey
                });
            } else {
                //@ts-ignore
                target['tTest_Bind_Property'] = [
                    {
                        label,
                        propertyKey
                    }
                ];
            }
        };
    }

    export function EmitTest(e: { label: string; scope: Object; funcName: string; args: Array<unknown> }) {
        const r = toRaw(e);
        const args = r.args.map((a) => {
            if (typeof a === 'function') {
                return a(r.scope);
            } else {
                return a;
            }
        });
        //@ts-ignore
        r.scope[`${r.funcName}`](...args);
    }

    export function WatchMemory() {
        if (typeof performance !== 'undefined' && 'memory' in performance) {
            setInterval(() => {
                //@ts-ignore
                memory.jsHeapSizeLimit = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
                //@ts-ignore
                memory.usedJSHeapSize = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
                //@ts-ignore
                memory.totalJSHeapSize = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
            }, 1000);
        }
    }
}
export { TTest };

import { Component } from '@/Libs/Component';
import { onMounted, onUnmounted } from 'vue';
import { TRouter } from './TRouter';

namespace TComponent {
    export const ComponentMap = new Map<string, Array<Component>>();

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TComponent_Generate_Hooks();
                    this.Mount();
                }

                private TComponent_Generate_Hooks() {
                    onMounted(() => {
                        let currentMap = ComponentMap.get(this.Route);
                        if (!currentMap) {
                            currentMap = [];
                            ComponentMap.set(this.Route, currentMap);
                        }
                        currentMap.push(this);
                    });

                    onUnmounted(() => {
                        let currentMap = ComponentMap.get(TRouter.lastPath.value);
                        if (currentMap) {
                            const index = currentMap.findIndex((c) => c === this);
                            if (index !== -1) {
                                currentMap.splice(index, 1);
                            }
                        }
                    });
                }

                private Mount() {
                    //@ts-ignore
                    if (!window.ComponentMap) {
                        //@ts-ignore
                        window.ComponentMap = ComponentMap;
                    }
                }
            };
        };
    }
}

export { TComponent };

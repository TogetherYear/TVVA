import { Component } from '@/Libs/Component';
import { onUnmounted } from 'vue';

namespace TComponent {
    export const components = new Set<Component>();

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TComponent_Generate_Hooks();
                }

                private TComponent_Generate_Hooks() {
                    components.add(this);

                    onUnmounted(() => {
                        components.delete(this);
                    });
                }
            };
        };
    }
}

export { TComponent };

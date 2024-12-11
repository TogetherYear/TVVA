import { Component } from '@/Libs/Component';

namespace TComponent {
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TComponent_Generate_Hooks();
                }

                private TComponent_Generate_Hooks() {}
            };
        };
    }
}

export { TComponent };

import { Entity } from '@/Libs/Entity';

namespace TEntity {
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Entity>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TEntity_Generate_Hooks();
                }

                private TEntity_Generate_Hooks() {}
            };
        };
    }
}

export { TEntity };

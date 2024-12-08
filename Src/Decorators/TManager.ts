import { Manager } from '@/Libs/Manager';

namespace TManager {
    export function Generate() {
        return function <T extends new (...args: Array<any>) => Manager>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TManager_Generate_Hooks();
                }

                private TManager_Generate_Hooks() {}
            };
        };
    }
}

export { TManager };

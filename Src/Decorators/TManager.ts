import { Manager } from '@/Libs/Manager';

namespace TManager {
    export const manager: Array<Manager> = [];

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Manager>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TManager_Generate_Hooks();
                    this.Mount();
                }

                private TManager_Generate_Hooks() {
                    manager.push(this);
                }

                private Mount() {
                    //@ts-ignore
                    if (!window.manager) {
                        //@ts-ignore
                        window.manager = manager;
                    }
                }
            };
        };
    }
}

export { TManager };

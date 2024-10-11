import { Manager } from '@/Libs/Manager';

namespace TManager {
    export const Manager: Array<Manager> = [];

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Manager>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TManager_Generate_Hooks();
                    this.Mount();
                }

                private TManager_Generate_Hooks() {
                    Manager.push(this);
                }

                private Mount() {
                    //@ts-ignore
                    if (!window.Manager) {
                        //@ts-ignore
                        window.Manager = Manager;
                    }
                }
            };
        };
    }
}

export { TManager };

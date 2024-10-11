import { Manager } from '@/Libs/Manager';
import { onMounted, onUnmounted, ref, toRaw } from 'vue';

class Test extends Manager {
    private isShow = ref<boolean>(true);

    public InitStates() {
        return {
            isShow: this.isShow
        };
    }

    public Run() {
        this.isShow.value = import.meta.env.DEV;
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}

    public OnClickTest(e: { label: string; scope: Object; funcName: string; args: Array<unknown> }) {
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
}

const TestInstance = new Test();

export { TestInstance as Test };

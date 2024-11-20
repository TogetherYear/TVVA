import { TTest } from '@/Decorators/TTest';
import { Manager } from '@/Libs/Manager';
import { onMounted, onUnmounted, ref } from 'vue';

class Test extends Manager {
    private isShow = ref<boolean>(true);

    public InitStates() {
        return {
            isShow: this.isShow
        };
    }

    public Run() {
        this.isShow.value = import.meta.env.DEV;
        onMounted(() => {
            TTest.WatchMemory();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    public Destroy() {}
}

const TestInstance = new Test();

export { TestInstance as Test };

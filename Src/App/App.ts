import { Manager } from '@/Libs/Manager';
import { onMounted, onUnmounted } from 'vue';

class App extends Manager {
    public InitStates() {
        return {};
    }

    public InitHooks() {}

    public Run() {
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}
}

const AppInstance = new App();

export { AppInstance as App };

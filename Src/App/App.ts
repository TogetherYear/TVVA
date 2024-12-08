import { I } from '@/Instructions/I';
import { Manager } from '@/Libs/Manager';
import { Theme } from '@/Theme/Theme';
import { onMounted, onUnmounted } from 'vue';

class App extends Manager {
    public InitStates() {
        return {};
    }

    public InitHooks() {}

    public Run() {
        Theme.LoadTheme(I.Theme.Style.Dark);
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}
}

const AppInstance = new App();

export { AppInstance as App };

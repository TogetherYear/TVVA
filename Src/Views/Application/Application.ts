import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { TTest } from '@/Decorators/TTest';
import { Renderer } from '@/Plugins/Renderer';

class Application extends Component {
    public constructor() {
        super();
    }

    public InitStates() {
        return {};
    }

    public Run() {
        onMounted(async () => {});

        onUnmounted(async () => {
            this.Destroy();
        });
    }

    protected Destroy() {}

    @TTest.BindFunction('Reload')
    private Reload() {
        location.reload();
    }

    @TTest.BindFunction('Test')
    private async Test() {
        const result = (await Renderer.App.Invoke('GetTestInfo')) as string;
        console.log(result);
    }
}

export { Application };

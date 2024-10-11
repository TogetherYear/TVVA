import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';

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
}

export { Application };

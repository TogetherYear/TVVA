import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { onMounted, onUnmounted } from 'vue';

class Empty extends Component {
    public constructor() {
        super();
    }

    public InitStates() {
        return {};
    }

    public Run() {
        onMounted(async () => {
            await this.GenerateEvent();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}

    private async GenerateEvent() {
        await Renderer.Event.Emit(Renderer.Event.TauriEvent.TAURI, {
            event: Renderer.RendererEvent.Empty,
            extra: {}
        });
    }
}

export { Empty };

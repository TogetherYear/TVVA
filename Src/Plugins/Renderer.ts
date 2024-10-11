import { Manager } from '@/Libs/Manager';
import * as Tauri from '@tauri-apps/api';
import { TEvent } from '@/Decorators/TEvent';

@TEvent.Create(['Message', 'Empty'])
class Renderer extends Manager {
    public get App() {
        return {
            Invoke: (cmd: string, args?: Tauri.core.InvokeArgs) => {
                return Tauri.core.invoke(cmd, args);
            }
        };
    }

    public get Event() {
        return {
            Listen: Tauri.event.listen,
            Once: Tauri.event.once,
            Emit: Tauri.event.emit,
            TauriEvent: {
                ...Tauri.event.TauriEvent,
                TAURI: 'tauri://tauri'
            }
        };
    }

    public get RendererEvent() {
        return {
            Message: 'Message',
            Empty: 'Empty'
        };
    }

    public async Run() {
        this.ListenEvents();
    }

    private ListenEvents() {
        this.Event.Listen<Record<string, unknown>>(this.Event.TauriEvent.TAURI, async (e) => {
            const r = e.payload;
            if (r.event === this.RendererEvent.Empty) {
                this.Emit(this.RendererEvent.Empty, r);
            }
            this.Emit(this.RendererEvent.Message, r);
        });
    }
}

const RendererInstance = new Renderer();

export { RendererInstance as Renderer };

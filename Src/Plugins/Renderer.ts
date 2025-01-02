import { Manager } from '@/Libs/Manager';
import { TEvent } from '@/Decorators/TEvent';
import * as T from '@tauri-apps/api';

@TEvent.Create(['Empty'])
class Renderer extends Manager {
    public get App() {
        return {
            Invoke: (cmd: string, args?: T.core.InvokeArgs) => {
                return T.core.invoke(cmd, args);
            }
        };
    }

    public get Widget() {
        return {
            Listen: T.window.Window.getCurrent().listen.bind(T.window.Window.getCurrent())
        };
    }

    public get Event() {
        return {
            Listen: T.event.listen,
            Once: T.event.once,
            Emit: T.event.emit,
            TauriEvent: {
                ...T.event.TauriEvent,
                TAURI: 'tauri://tauri'
            }
        };
    }

    public get RendererEvent() {
        return {
            Empty: 'Empty'
        };
    }

    public async Run() {
        this.ListenEvents();
    }

    private ListenEvents() {
        this.Widget.Listen<Record<string, unknown>>(this.Event.TauriEvent.TAURI, async (e) => {
            const r = e.payload;
            if (r.event === this.RendererEvent.Empty) {
                this.Emit(this.RendererEvent.Empty, r);
            }
        });
    }
}

const RendererInstance = new Renderer();

export { RendererInstance as Renderer };

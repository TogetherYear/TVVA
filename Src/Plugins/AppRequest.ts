import { TRouter } from '@/Decorators/TRouter';
import { TTool } from '@/Decorators/TTool';
import { Manager } from '@/Libs/Manager';
import { LocalStore } from './LocalStore';
import { ToLogin } from '@/Demands/Login';
import { Renderer } from './Renderer';

/**
 * Axios请求
 */
class AppRequest extends Manager {
    constructor() {
        super();
    }

    /**
     * 这里放不需要重复请求接口的 code  ( 其实一般除了 401 没有权限需要重新请求 其他基本都不需要 但还是把这里做个中间层 )
     */
    private passCode = [0, 400, 404, 500];

    /**
     * 这里放不需要加 Token 的接口 参数不需要加上
     */
    private passToken = ['/system/auth/rsa/public/key'];

    private refreshing = false;

    private ResetAccount() {
        LocalStore.SetLocal('Token', '');
    }

    private async PassRequest(e: any) {
        if (e.message === 'Request canceled') {
            return true;
        }
        if (e.code === 401) {
            if (LocalStore.GetLocal('Token') && LocalStore.GetLocal('Account')) {
                /**
                 * 我这里会自动刷新 Token 不会跳回登录
                 */
                await this.RefreshToken();
                return false;
            } else {
                return true;
            }
        }
        if (this.passCode.indexOf(e.code) !== -1) {
            return true;
        }
        return false;
    }

    private async RefreshToken() {
        return new Promise((resolve, reject) => {
            if (!this.refreshing) {
                /**
                 * 第一个进入的接口去刷新 Token
                 */
                this.refreshing = true;
                const data = {
                    username: LocalStore.GetLocal('Account'),
                    password: LocalStore.GetLocal('Password')
                };
                ToLogin(data).then((res) => {
                    if (res.code === 0) {
                        LocalStore.SetLocal('Token', res.data.data.accessToken);
                        this.refreshing = false;
                        resolve({});
                    }
                });
            } else {
                /**
                 * 其余的接口去等待 Token 刷新
                 */
                const timer = setInterval(() => {
                    if (!this.refreshing) {
                        resolve('');
                        clearInterval(timer);
                    }
                }, 500);
            }
        });
    }

    private SetHasToken(url: string) {
        for (let t of this.passToken) {
            if (url.indexOf(t) !== -1) {
                return false;
            }
        }
        return true;
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public async Get(url: string) {
        const targetUrl = `${import.meta.env.VITE_APP_SERVER_PORT}${url}`;
        const ac = new AbortController();
        const request = Renderer.Request.Fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.SetHasToken(targetUrl) ? `Bearer ${LocalStore.GetLocal('Token')}` : ''
            },
            signal: ac.signal
        });
        TRouter.requestAbort.push(ac);
        return await (await request).json();
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public async Post(url: string, data?: Record<string, unknown>) {
        const targetUrl = `${import.meta.env.VITE_APP_SERVER_PORT}${url}`;
        const ac = new AbortController();
        const request = Renderer.Request.Fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.SetHasToken(targetUrl) ? `Bearer ${LocalStore.GetLocal('Token')}` : ''
            },
            body: JSON.stringify(data),
            signal: ac.signal
        });
        TRouter.requestAbort.push(ac);
        return await (await request).json();
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public async Delete(url: string) {
        const targetUrl = `${import.meta.env.VITE_APP_SERVER_PORT}${url}`;
        const ac = new AbortController();
        const request = Renderer.Request.Fetch(targetUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.SetHasToken(targetUrl) ? `Bearer ${LocalStore.GetLocal('Token')}` : ''
            },
            signal: ac.signal
        });
        TRouter.requestAbort.push(ac);
        return await (await request).json();
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public async Put(url: string, data?: Record<string, unknown>) {
        const targetUrl = `${import.meta.env.VITE_APP_SERVER_PORT}${url}`;
        const ac = new AbortController();
        const request = Renderer.Request.Fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.SetHasToken(targetUrl) ? `Bearer ${LocalStore.GetLocal('Token')}` : ''
            },
            body: JSON.stringify(data),
            signal: ac.signal
        });
        TRouter.requestAbort.push(ac);
        return await (await request).json();
    }
}

const AppRequestInstance = new AppRequest();

export { AppRequestInstance as AppRequest };

import { TRouter } from '@/Decorators/TRouter';
import { TTool } from '@/Decorators/TTool';
import { Manager } from '@/Libs/Manager';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LocalStore } from './LocalStore';
import { ElMessage } from 'element-plus';
import { ToLogin } from '@/Demands/Login';

/**
 * Axios请求
 */
class AppRequest extends Manager {
    constructor() {
        super();
        this.CreatRequest();
    }

    private request!: AxiosInstance;

    /**
     * 这里放需要重复请求接口的 code
     */
    private passCode: Array<number> = [];

    /**
     * 这里放不需要加 Token 的接口 参数不需要加上
     */
    private passToken = ['/system/auth/rsa/public/key'];

    /**
     * 这里放不需要显示错误信息的
     */
    private passMessage = [401];

    public get R() {
        return this.request;
    }

    private refreshing = false;

    private CreatRequest() {
        this.request = axios.create({
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.SetRequest();
        this.SetResponse();
    }

    private SetRequest() {
        this.R.interceptors.request.use(
            (config: any) => {
                if (config && config.headers) {
                    config.headers['Authorization'] = `Bearer ${LocalStore.GetLocal('Token')}`;
                    for (let t of this.passToken) {
                        if (config.url.indexOf(t) !== -1) {
                            delete config.headers.Authorization;
                            break;
                        }
                    }
                    config.baseURL = import.meta.env.VITE_APP_SERVER_PORT;
                    return config;
                }
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    private SetResponse() {
        this.R.interceptors.response.use(
            (response) => {
                if (response.data.code === 0) {
                    return response;
                } else {
                    if (this.passMessage.indexOf(response.data.code) === -1) {
                        ElMessage({
                            type: 'error',
                            message: response.data.msg
                        });
                    }
                    return Promise.reject(response);
                }
            },
            (err) => {
                return Promise.reject(err);
            }
        );
    }

    private ResetAccount() {
        LocalStore.SetLocal('Token', '');
    }

    private async PassRequest(e: any) {
        if (e.status === 404) {
            return true;
        }
        if (e.message === 'canceled') {
            return true;
        }
        if (e.data && e.data.code === 401) {
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
        if (e.data && this.passCode.indexOf(e.data.code) === -1) {
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

                // 根据具体接口 改下面
                const data = {
                    username: LocalStore.GetLocal('Account'),
                    password: LocalStore.GetLocal('Password')
                };
                ToLogin(data).then((res) => {
                    if (res.data.code === 0) {
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

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public Get(url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        const ac = new AbortController();
        const request = this.R.get(url, { ...config, signal: ac.signal });
        TRouter.requestAbort.push(ac);
        return request;
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public Post(url: string, data?: Record<string, unknown>, config?: Omit<AxiosRequestConfig, 'signal'>) {
        const ac = new AbortController();
        const request = this.R.post(url, data, { ...config, signal: ac.signal });
        TRouter.requestAbort.push(ac);
        return request;
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public Delete(url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        const ac = new AbortController();
        const request = this.R.delete(url, { ...config, signal: ac.signal });
        TRouter.requestAbort.push(ac);
        return request;
    }

    @TTool.Retry<AppRequest>(10, 1000, (instance, e) => instance.PassRequest(e))
    public Put(url: string, data?: Record<string, unknown>, config?: Omit<AxiosRequestConfig, 'signal'>) {
        const ac = new AbortController();
        const request = this.R.put(url, data, { ...config, signal: ac.signal });
        TRouter.requestAbort.push(ac);
        return request;
    }
}

const AppRequestInstance = new AppRequest();

export { AppRequestInstance as AppRequest };

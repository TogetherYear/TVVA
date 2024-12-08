import { AppRequest } from '@/Plugins/AppRequest';

const ToLogin = (data: Record<string, any>): Promise<any> => {
    return AppRequest.Post('/system/auth/login', data);
};

export { ToLogin };

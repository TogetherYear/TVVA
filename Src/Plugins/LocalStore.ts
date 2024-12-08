import { I } from '@/Instructions/I';
import { Manager } from '../Libs/Manager';

class LocalStore extends Manager {
    public SetLocal(key: keyof I.LocalStoreKey, value: string) {
        localStorage.setItem(`TVVA_Exceed_${key}`, value);
    }

    public GetLocal(key: keyof I.LocalStoreKey) {
        return localStorage.getItem(`TVVA_Exceed_${key}`) || '';
    }
}

const LocalStoreInstance = new LocalStore();

export { LocalStoreInstance as LocalStore };

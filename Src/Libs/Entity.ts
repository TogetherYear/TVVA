import { Time } from '@/Utils/Time';
import { EventSystem } from './EventSystem';
import { TEntity } from '@/Decorators/TEntity';
import { TComponent } from '@/Decorators/TComponent';
import { TRouter } from '@/Decorators/TRouter';

/**
 * 根 我用来代理一些变量的
 */
@TEntity.Generate()
class Entity extends EventSystem {
    /**
     * 唯一ID
     */
    public unique_Id = Time.GenerateRandomUid();

    /**
     * 当前页面路由
     */
    public get Route() {
        return TRouter.currentPath.value;
    }

    /**
     * 当前页面参数
     */
    public get Query() {
        return TRouter.currentQuery;
    }

    /**
     * 获取当前页面所有存活的 Component
     */
    public GetAllComponent() {
        return TComponent.ComponentMap.get(TRouter.currentPath.value);
    }

    /**
     * 根据条件获取 Component
     */
    public GetComponent<T>(Condition: (instance: T & Record<string, unknown>) => boolean): T | null {
        const current = TComponent.ComponentMap.get(TRouter.currentPath.value)!;
        for (let c of current) {
            if (Condition(c as any)) {
                return c as T;
            }
        }
        return null;
    }
}

export { Entity };

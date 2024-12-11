import { Time } from '@/Utils/Time';
import { EventSystem } from './EventSystem';
import { TEntity } from '@/Decorators/TEntity';
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
}

export { Entity };

/**
 * 这个是唯一的 用来给装饰器用的 因为有些时候执行顺序不一致 导致变量拿不到 我会用这个去在下次事件循环在执行
 */
const Resolve = Promise.resolve();

export { Resolve };

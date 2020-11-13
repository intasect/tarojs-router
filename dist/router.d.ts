import { IRoute, NavigateOptions, RouterConfig } from './common';
import Taro from '@tarojs/taro';
export declare class Router {
    private static _config?;
    /** 初始化配置 */
    static config(config: RouterConfig): void;
    /**
     * 页面跳转
     * @param route 目标路由对象
     * @param options 跳转选项
     */
    static navigate<T = Taro.General.CallbackResult>(route: IRoute, options?: NavigateOptions): Promise<T>;
    /**
     * 返回上一个页面
     * @param route 当没有页面可以返回，前往的页面
     */
    static back(route?: IRoute): Promise<void> | Promise<Taro.General.CallbackResult>;
    /** 发送 backData、backError 数据到上一个页面 */
    static emitBack(): void;
    /**
     * 获取上一个页面携带过来的数据
     * @param default_data 默认数据
     */
    static getData<T = any>(default_data?: T): T | undefined;
    /**
     * 返回上一个页面并返回数据。
     * 如果是 class 页面组件，请在页面级组件使用 @RouterEmit 装饰，
     * 如果是函数组件，请调用 useRouter，否则 backData 无法成功返回数据到上一个页面
     * @param data 返回的数据
     */
    static backData(data?: any): Promise<void> | Promise<Taro.General.CallbackResult>;
    /**
     * 返回上一个页面并抛出异常
     * 如果是 class 页面组件，请在页面级组件使用 @RouterEmit 装饰，
     * 如果是函数组件，请调用 useRouter，否则 backError 无法成功抛出异常到上一个页面
     * @param err 抛出的异常
     */
    static backError(err: any): Promise<void> | Promise<Taro.General.CallbackResult>;
}

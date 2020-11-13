import { Router } from './router';
export declare function useRouter(defaultParams?: any): {
    /** 路由参数 */
    params: any;
    /** 上一个页面携带过来的数据 */
    data: any;
    /** 返回上一个页面并返回数据 */
    backData: typeof Router.backData;
    /** 返回上一个页面并抛出异常 */
    backError: typeof Router.backError;
    /** 返回上一个页面 */
    back: typeof Router.back;
};

/** @internal */
export declare class PageData {
    static _pageData: Map<string, any>;
    static _pagePromise: Map<string, {
        res: (val: any) => void;
        rej: (err: any) => void;
    }>;
    static _backErr: Map<string, any>;
    static _backData: Map<string, any>;
    static getPageData<T = any>(default_data?: T): T;
    static delPageData(): void;
    static getPagePromise(): {
        res: (val: any) => void;
        rej: (err: any) => void;
    } | undefined;
    static delPagePromise(): void;
    static setPageData(route_key: string, data: any): void;
    static setPagePromise(route_key: string, options: {
        res: (val: any) => void;
        rej: (err: any) => void;
    }): void;
    static emitBack(): void;
    static setBackData(data?: any): void;
    static setBackError(err: any): void;
}

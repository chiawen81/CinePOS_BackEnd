

export interface ManagerMovieListSuccessDataInnerCustomer {

    runtime?: Number;
    rate?: Number;
    /**
     * 電影編號
     */
    _id?: string;
    /**
     * 上映狀態文字
     */
    statusName?: number;
    /**
     * 電影名稱
     */
    title?: string;
    /**
     * 劇情類型文字
     */
    genreName?: Array<string>;
    /**
     * 分級制度文字
     */
    rateName?: string;
    /**
     * 發行日期
     */
    releaseDate?: any;
    /**
     * 支援設備文字
     */
    provideVersionName?: Array<string>;
}
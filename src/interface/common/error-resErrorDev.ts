import { ErrorInfo } from "./error-info";

export interface ErrorResErrorDev {
    status?: number;
    statusCode?: number;
    body?: any;
    stack?: string;
    detailInfo?: ErrorInfo;
    name?: string;
    message?: string;
}
import { Request, Response, NextFunction } from "express";

class ErrorService {

    constructor() {
        // 同步錯誤
        process.on('uncaughtException', (err: Error) => {
            // 記錄錯誤下來，等到服務都處理完後，停掉該 process
            console.error('【同步錯誤】Uncaughted Exception！')
            console.error(err);
            process.exit(1);
        });

        // 非同步錯誤
        process.on('unhandledRejection', (reason: any, promise: any) => {
            console.error('【非同步錯誤】未捕捉到的 rejection：', promise, '原因：', reason);
        });

    }



    // ——————————  擴充async fun，加上catch捕捉錯誤訊息  ——————————
    handleErrorAsync = function handleErrorAsync(func: Function) {
        console.log('有進來 handleErrorAsync');
        return function (req: Request, res: Response, next: NextFunction) {
            func(req, res, next).catch(
                function (error: Error) {
                    return next(error);
                }
            );
        };
    };



    // ——————————  設定錯誤訊息  ——————————
    appError = (httpStatus: number, errMessage: string, next: NextFunction) => {
        const error: any = new Error(errMessage);
        error.statusCode = httpStatus;
        error.isOperational = true;
        console.log('appError', httpStatus, errMessage);
        next(error);
    }



    // ——————————  自己設定的 err 錯誤  ——————————
    resErrorProd = (err: ErrorInfo, res: Response) => {
        console.log('resErrorProd');
        if (err.isOperational) {
            res.status(err.statusCode).json({
                code: -1,
                message: err.message
            });
        } else {
            // log 紀錄
            console.error('出現重大錯誤', err);

            // 送出罐頭預設訊息
            res.status(500).json({
                code: -1,
                message: '系統錯誤，請恰系統管理員'
            });
        }
    };



    // ——————————  開發環境錯誤  ——————————
    resErrorDev = (err: ErrorInfo, res: Response, req: Request) => {
        console.log('resErrorDev');
        let error = {
            statusCode: err.statusCode,
            status: err.statusCode,
            body: req.body,
            message: err.message,
            stack: err.stack,
            detailInfo: err,
            // note: 以下訊息不一定有值
            // type: err.errors.type.message
            // expose: err.expose,      
        };
        res.writeHead(err.statusCode || 500, process.env.HEADERS);
        res.write(JSON.stringify({
            status: err.status,
            message: err.message,
            error: error,
            stack: err.stack
        }));
        res.end();
    };



    // ——————————  自訂錯誤  ——————————
    catchCustomError = (err: ErrorInfo, req: Request, res: Response, next: NextFunction) => {
        console.log('catchCustomError');
        // 測試機環境dev
        err.statusCode = err.statusCode || 500;
        if (process.env.NODE_ENV === 'dev') {
            return this.resErrorDev(err, res, req);
        }

        // 正式機環境production
        if (err.name === 'ValidationError') {
            err.message = "資料欄位未填寫正確，請重新輸入！"
            err.isOperational = true;
            return this.resErrorProd(err, res)
        };
        this.resErrorProd(err, res);
    };

};



export default new ErrorService();
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorService {
    constructor() {
        this.handleErrorAsync = function handleErrorAsync(func) {
            console.log('有進來 handleErrorAsync');
            return function (req, res, next) {
                func(req, res, next).catch(function (error) {
                    return next(error);
                });
            };
        };
        this.appError = (httpStatus, errMessage, next) => {
            const error = new Error(errMessage);
            error.statusCode = httpStatus;
            error.isOperational = true;
            console.log('appError', httpStatus, errMessage);
            next(error);
        };
        this.resErrorProd = (err, res) => {
            console.log('resErrorProd');
            if (err.isOperational) {
                res.status(err.statusCode).json({
                    code: -1,
                    message: err.message
                });
            }
            else {
                console.error('出現重大錯誤', err);
                res.status(500).json({
                    code: -1,
                    message: '系統錯誤，請恰系統管理員'
                });
            }
        };
        this.resErrorDev = (err, res, req) => {
            console.log('resErrorDev');
            let error = {
                statusCode: err.statusCode,
                status: err.statusCode,
                body: req.body,
                message: err.message,
                stack: err.stack,
                detailInfo: err,
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
        this.catchCustomError = (err, req, res, next) => {
            console.log('catchCustomError');
            err.statusCode = err.statusCode || 500;
            if (process.env.NODE_ENV === 'dev') {
                return this.resErrorDev(err, res, req);
            }
            if (err.name === 'ValidationError') {
                err.message = "資料欄位未填寫正確，請重新輸入！";
                err.isOperational = true;
                return this.resErrorProd(err, res);
            }
            ;
            this.resErrorProd(err, res);
        };
        process.on('uncaughtException', (err) => {
            console.error('【同步錯誤】Uncaughted Exception！');
            console.error(err);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            console.error('【非同步錯誤】未捕捉到的 rejection：', promise, '原因：', reason);
        });
    }
}
;
exports.default = new ErrorService();

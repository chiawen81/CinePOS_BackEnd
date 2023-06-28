"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseService {
    constructor() {
        this.setHeaderCROS = (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        };
    }
}
exports.default = new ResponseService();

const jwt = require('jsonwebtoken');
import ErrorService from '../service/error';
import User from '../models/common/usersModels';

class AuthService {
    // ——————————  產生JWT token——————————
    sendBackJWT = (reqData, res, statusCode) => {
        console.log(reqData._id)
        let data = {
            id: reqData._id,
            name: reqData.name,
            staffId: reqData.staffId,
            stickerUrl: ""    // ====待補大頭貼照片====
        };

        // 產生 JWT token
        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_DAY
        });

        // 回傳JWT
        res.status(statusCode).json({
            code: 1,
            message: "已成功登入!",
            data: {
                staffId: reqData.staffId,
                name: reqData.name,
                token
            }
        });
    }



    // ——————————  JWT驗證  ——————————
    isAuth = ErrorService.handleErrorAsync(async (req, res, next) => {
        // 取得Client端的JWT token   
        let token;
        let { staffId } = req.body;
        staffId = staffId ?? req.query.staffId;// 員編可以放在body或網址參數
        console.log('登入者- staffId', staffId);

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('目前使用的token', token);
        } else {
            return next(ErrorService.appError(401, "請重新登入！", next));
        };

        // 驗證 token 正確性
        const decodedClientData: any = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('payload', payload);
                    resolve(payload);
                };
            })
        });
        console.log('decodedClientData', decodedClientData);

        if (decodedClientData.staffId === staffId) {
            // 抓出資料庫中的使用者資料
            const currentUser = await User.findOne({ staffId: decodedClientData.staffId });
            console.log('currentUser', currentUser);
            req.user = currentUser;                 // 將使用者資料放入req.user
            next();

        } else {
            return next(ErrorService.appError(403, "只能修改本人姓名", next));
        };
    });

}



export default new AuthService();
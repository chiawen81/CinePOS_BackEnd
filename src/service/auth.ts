import jwt from "jsonwebtoken";
import User from '../models/usersModels';
import ErrorService from '../service/error';

class AuthService {
    // 產生JWT token
    sendBackJWT = (reqData, res, statusCode) => {
        console.log(reqData._id)
        // 產生 JWT token
        const token = jwt.sign({ id: reqData._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_DAY
        });

        // 回傳JWT
        res.status(statusCode).json({
            status: 'success',
            statusCode,
            user: {
                token,
                name: reqData.name
            }
        });
    }

    // JWT驗證 
    isAuth = ErrorService.handleErrorAsync(async (req, res, next) => {
        // 取得Client端的JWT token   
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('token', token);
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

        // 抓出資料庫中的使用者資料
        const currentUser = await User.findOne({ id: decodedClientData.id });
        console.log('currentUser', currentUser);
        req.user = currentUser;
        next();
    });
}



export default new AuthService();
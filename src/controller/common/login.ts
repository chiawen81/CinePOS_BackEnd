import validator from "validator";
import bcrypt from "bcryptjs";
import ErrorService from '../../service/error';
import AuthService from '../../service/auth';
import User from '../../models/usersModels';
import { Request, Response, NextFunction } from 'express';
import { LoginReq } from "src/interface/swagger-model/loginReq";
import { LoginRes } from "src/interface/swagger-model/loginRes";

class LogInController {
    constructor() {

    }


    // ———————————————————————  登入系統  ———————————————————————
    logIn = async (req: Request<{}, LoginRes, LoginReq, {}, {}>, res: Response<LoginRes>, next: NextFunction) => {
        console.log('req', req);
        console.log('進來登入了～', req.originalUrl.split('/')[1]);
        let staffId = req.body.staffId;
        let password = req.body.password;
        console.log('staffId', staffId, 'password', password);

        let passwordValidator = validator.isLength(password, { min: 8 });
        let staffIdValidator = validator.isLength(staffId, { min: 5 });
        console.log('passwordValidator', passwordValidator, 'staffIdValidator', staffIdValidator);

        if (passwordValidator && staffIdValidator) {
            let role = (req.originalUrl.split('/')[2] === "manager") ? "manager" : "staff";
            console.log('role', role);

            // 驗證密碼
            try {
                const user = await User.findOne({ staffId, role }).select('+password');
                console.log('user', user);

                if (!user) {
                    return next(ErrorService.appError(401, "查無此人！", next));
                };
                console.log('password', password, 'user.password', user.password);
                const result = await bcrypt.compare(password, user.password);

                if (result) {
                    console.log('身份證確');
                    AuthService.sendBackJWT(user, res, 200);
                } else {
                    return next(ErrorService.appError(401, "密碼錯誤！", next));
                };

            } catch (error) {
                return next(ErrorService.appError(500, "其它錯誤！", next));
            };

        } else {
            console.log(2)
            return next(ErrorService.appError(401, "欄位驗證錯誤，請確認填寫的資料！", next));
        };
    }


}



export default new LogInController();
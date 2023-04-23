import User from '../models/usersModels';
import ErrorService from '../service/error';
import AuthService from '../service/auth';
import validator from "validator";
import bcrypt from "bcryptjs";

class LogInController {
    constructor() {

    }

    // ———————————————————————  登入系統  ———————————————————————
    lonIn = async (req, res, next) => {
        console.log('進來登入了～');
        let { staffId, password } = req.body;
        console.log('staffId', staffId, 'password', password);

        let passwordValidator = validator.isLength(password, { min: 8 });
        let staffIdValidator = validator.isLength(staffId, { min: 5 });
        console.log('passwordValidator', passwordValidator, 'staffIdValidator', staffIdValidator);

        if (passwordValidator && staffIdValidator) {
            // 驗證密碼
            const user = await User.findOne({ staffId }).select('+password');
            console.log('user', user, user.name, user.password);
            console.log('password', password, 'user.password', user.password);
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                console.log('身份證確');
                AuthService.sendBackJWT(user, res, 200);
            } else {
                return next(ErrorService.appError(200, "欄位驗證錯誤！", next));
            };

        } else {
            console.log(2)
            return next(ErrorService.appError(200, "欄位驗證錯誤！", next));
        };
    }


}



export default new LogInController();
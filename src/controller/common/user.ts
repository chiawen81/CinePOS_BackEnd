import validator from "validator";
import User from '../../models/common/usersModels';
import ErrorService from './../../service/error';
import { NextFunction } from "express";

class UserController {
    constructor() {

    }

    // 更新使用者姓名
    changeUserName = async (req, res, next: NextFunction) => {
        console.log("抓到路由- profile");
        const { newName } = req.body;
        const { staffId } = req.user;
        console.log('newName', newName, 'staffId', staffId);

        // 驗證欄位
        if (!validator.isLength(newName, { min: 2 })) {
            return next(ErrorService.appError(401, "姓名欄位驗證錯誤！", next));
        };
        console.log(req.originalUrl.split('/'));
        let role = (req.originalUrl.split('/')[2] === "manager") ? "manager" : "staff";
        const user = await User.findOne({ staffId, role }).select('+password');

        if (!user) {
            return next(ErrorService.appError(401, "查無此人！", next));
        };

        try {
            const updatedUser = await User.findOneAndUpdate(
                { staffId },        // 條件
                { name: newName },  // 更新的內容
                { new: true }       // 參數(表示返回更新後的文檔。如果沒有設置這個參數，則返回更新前的文檔。)
            );
            console.log('updatedUser ', updatedUser);

            if (!updatedUser) {
                return next(ErrorService.appError(401, "查無此人！", next));
            };

            res.status(200).json({
                code: 1,
                message: "已經成功修改姓名!",
                data: {
                    staffId: updatedUser.staffId,
                    newName: updatedUser.name
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    }
}



export default new UserController();
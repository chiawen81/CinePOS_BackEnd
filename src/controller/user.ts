import validator from "validator";
import User from '../models/usersModels';
import ErrorService from '../service/error';

class UserController {
    constructor() {

    }

    // 更新使用者姓名
    changeUserName = async (req, res, next) => {
        console.log("抓到路由- user/info/update");
        const { newName, staffId } = req.body;

        // 驗證欄位
        if (!validator.isLength(newName, { min: 2 })) {
            return next(ErrorService.appError(400, "姓名欄位驗證錯誤！", next));
        };
        let role = (req.originalUrl.split('/')[1] === "admin") ? "manager" : "staff";
        const user = await User.findOne({ staffId, role }).select('+password');

        if (!user) {
            return next(ErrorService.appError(400, "查無此人！", next));
        };

        try {
            const updatedUser = await User.findOneAndUpdate(
                { staffId },        // 條件
                { name: newName },  // 更新的內容
                { new: true }       // 參數(表示返回更新後的文檔。如果沒有設置這個參數，則返回更新前的文檔。)
            );
            console.log('updatedUser ', updatedUser);

            if (!updatedUser) {
                return next(ErrorService.appError(400, "查無此人！", next));
            };

            res.status(200).json({
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
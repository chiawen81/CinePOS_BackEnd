import validator from "validator";
import User from '../../models/common/usersModels';
import ErrorService from './../../service/error';
import UploadController from "./../../controller/common/upload";
import { NextFunction } from "express";

class UserController {
    constructor() {

    }

    // ———————————————————————  更新使用者姓名  ———————————————————————
    changeUserName = async (req, res, next: NextFunction) => {
        console.log("抓到路由- profile");
        const { newName } = req.body;
        const { staffId } = req.user;
        console.log('newName', newName, 'staffId', staffId);

        // 驗證欄位
        if (!validator.isLength(newName, { min: 2 })) {
            return next(ErrorService.appError(401, "姓名欄位驗證錯誤！", next));
        };

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





    // ———————————————————————  更新大頭貼  ———————————————————————
    changeSticker = async function changeSticker(req, res, next) {
        console.log('自訂義程式(更新大頭貼) 之我接到囉～');
        console.log('req.fileData', req.fileData);
        console.log('req.user', req.user);

        try {
            let updateData = {
                stickerUrl: req.fileData.imgUrl,
                stickerFileName: req.fileData.fileName
            };
            let condition = { staffId: req.user.staffId };

            const updatedUser = await User.findOneAndUpdate(
                condition,          // 條件
                updateData,         // 更新的內容
                { new: true }       // 參數(表示返回更新後的文檔。如果沒有設置這個參數，則返回更新前的文檔。)
            );
            console.log('updatedUser ', updatedUser);

            // 回傳client端成功訊息
            res.send({
                code: 1,
                message: '上傳成功！',
                data: {
                    stickerFileName: updateData.stickerFileName,
                    stickerUrl: updateData.stickerUrl,
                }
            });

            // 刪除舊大頭貼
            UploadController.deleteFile(req, res, next, req.user.stickerFileName);

        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    }





    // ———————————————————————  其它  ———————————————————————
    // 比對使用者
    async filterTargetUser(condition: any, next: NextFunction) {
        const user = await User.findOne(condition).select('+password');
        console.log('比對使用者:', user);

        if (!user) {
            return next(ErrorService.appError(401, "查無此人！", next));
        } else {
            return user;
        };
    }



}



export default new UserController();
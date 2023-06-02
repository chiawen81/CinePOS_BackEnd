import { Request, Response, NextFunction } from 'express';
import Option from '../../models/optionsModels';
import ErrorService from "./../../service/error";
import { CommonOptionSuccessDataItem } from 'src/interface/swagger-model/commonOptionSuccessDataItem';
import { CommonOptionSuccess } from 'src/interface/swagger-model/commonOptionSuccess';

class OptionController {
    constructor() {

    }

    // ———————————————————————  取得選項  ———————————————————————
    getOptionData = async (req: Request<{}, CommonOptionSuccess, {}, number, {}>, res: Response<CommonOptionSuccess>, next: NextFunction) => {
        let typeId = Number(req.params['typeId']);
        let optionData: CommonOptionSuccessDataItem[] = [];
        console.log('id', typeId);

        if (!typeId) {
            return next(ErrorService.appError(401, "請輸入要查詢的選項欄位代碼！", next));
        };

        optionData = await Option.find({ typeId });
        console.log('option', optionData);

        try {
            if (optionData.length) {
                res.status(200).json({
                    code: 1,
                    message: "成功取得選項資料!",
                    data: optionData
                });

            } else {
                return next(ErrorService.appError(401, "查無資料！請確認是否正確輸入要查詢的選項欄位代碼！", next));
            };

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "更新姓名錯誤(其它)!",
            });
        };

    };


}



export default new OptionController();
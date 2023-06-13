import { Request, Response, NextFunction } from 'express';
import ErrorService from '../../service/error';
import Order from 'src/models/orderModels';
const moment = require('moment');

class DashboardController {

    constructor() {

    }

    getMetric = async (req: Request<{}, any/**res的型別 */, null, string, {}>, res: Response, next: NextFunction) => {
        let metricData = {};                                                                        // 要回傳client端的資料

        try {
            metricData["metricOfTodayIncome"] = await this.getMetricOfTodayIncome(next);            // 本日累計營收

            res.status(200).json({
                code: 1,
                message: '成功取得指標！',
                data: metricData
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || '取得指標失敗(其他)！',
            });
        };
    }



    // ———————————————————————  本日累計營收  ———————————————————————
    // 本日累計營收(總)
    async getMetricOfTodayIncome(next: NextFunction) {
        // 取得日期
        let today: string = "2023/06/16";  // 今日的寫法moment=> moment().format('YYYY/MM/DD');     // 先寫死參數====
        let lastDay: string = moment(today, 'YYYY/MM/DD').subtract(1, 'days').format('YYYY/MM/DD');

        // 取得訂單資料
        let todayOrderData = await this.getRangeDateOrderData(today, today, next);
        let lastDayOrderData = await this.getRangeDateOrderData(lastDay, lastDay, next);
        console.log('todayOrderData', todayOrderData, 'lastDayOrderData', lastDayOrderData);

        // 計算指標
        let todayIncome = this.getOneDayTotalIncome(todayOrderData);
        let lastDayIncome = this.getOneDayTotalIncome(lastDayOrderData);
        let increasePercent = (todayIncome / lastDayIncome);
        let formatIncreasePercent = Math.floor(increasePercent * Math.pow(10, 1)) / Math.pow(10, 1);
        console.log('todayIncome', todayIncome, 'formatIncreasePercent', formatIncreasePercent);

        return {
            todayIncome: todayIncome,
            increasePercent: formatIncreasePercent
        };
    }



    // 本日累計營收- 取得當日收入
    getOneDayTotalIncome(orderData: any[]): number {
        let total = 0;

        if (orderData?.length) {
            for (const data of orderData) {
                total += data.amount;
            };
        };

        console.log('取得當日收入', total);
        return total;
    }



    // 本日累計營收- 取得當日訂單資料
    getRangeDateOrderData(startDate: string, endDate: string, next: NextFunction): Promise<any> {
        const _startDate = moment(startDate, "YYYY/MM/DD").startOf('day');
        const _endDate = moment(endDate, "YYYY/MM/DD").endOf('day');

        return new Promise((resolve, reject) => {
            const searchCondition = {
                createdAt: {
                    $gte: _startDate.toDate(),
                    $lt: _endDate.toDate(),
                },
            };

            Order.find(searchCondition, (err, orderData) => {
                if (err) {
                    reject(ErrorService.appError(500, `尋找本日累計營收的訂單資料時發生錯誤:${err}`, next));
                } else {
                    console.log('orderData', orderData);
                    resolve(orderData);
                }
            });
        });
    }








}



export default new DashboardController();
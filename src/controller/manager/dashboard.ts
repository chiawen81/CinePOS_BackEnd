import { Request, Response, NextFunction } from 'express';
import ErrorService from '../../service/error';
import Order from 'src/models/orderModels';
import { ManagerDashboardBoxOfficePercentChartData, ManagerDashboardBoxOfficeRankChartData } from 'src/interface/manager';
import { StaffOrderCreateModel } from 'src/interface/staff/staffOrderModel';
import { StaffOrderCreateReqTicketList } from 'src/interface/swagger-model/staffOrderCreateReqTicketList';
import { DashboardMetricSuccess } from 'src/interface/swagger-model/dashboardMetricSuccess';
import { DashboardBoxOfficeChartSuccess } from 'src/interface/swagger-model/dashboardBoxOfficeChartSuccess';
const moment = require('moment');

class DashboardController {

    constructor() {

    }

    getMetric = async (req: Request<{}, DashboardMetricSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
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
    getOneDayTotalIncome(orderData: StaffOrderCreateModel[]): number {
        let total = 0;

        if (orderData?.length) {
            for (const data of orderData) {
                total += data.amount;
            };
        };

        console.log('取得當日收入', total);
        return total;
    }





    // ———————————————————————  票房收入  ———————————————————————
    // 票房收入
    getBoxOfficeStatistics = async (req: Request<{}, DashboardBoxOfficeChartSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
        let resData = { percentChartData: [], rankChartData: null };
        let today: string = "2023/06/16";  // 今日的寫法moment=> moment().format('YYYY/MM/DD');     // 先寫死參數====        
        let todayOrderData: StaffOrderCreateModel[] = [];

        // 取得訂單資料
        try {
            todayOrderData = await this.getRangeDateOrderData(today, today, next);

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: `取得本日累計營收的訂單資料時發生錯誤:${err.message}`,
            });
        };



        // 取得圖表資料並回傳client端
        try {
            if (todayOrderData?.length) {
                resData.percentChartData = this.getBoxOfficeStatisticsPercentChartData(todayOrderData);     // 票房佔比
                resData.rankChartData = this.getBoxOfficeStatisticsRankChartData(resData.percentChartData); // 票行排行
            };

            res.status(200).json({
                code: 1,
                message: '成功取得票房收入圖表資料！',
                data: resData
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: `取得票房收入圖表資料失敗(其他)！:${err.message}`,
            });
        };
    }



    // 票房收入- 取得佔比圖表資料
    getBoxOfficeStatisticsPercentChartData(todayOrderData: StaffOrderCreateModel[]): ManagerDashboardBoxOfficePercentChartData[] {
        let chartData: ManagerDashboardBoxOfficePercentChartData[] = [];

        if (todayOrderData?.length) {
            // 取得圖表資料
            for (let idx = 0; idx < todayOrderData.length; idx++) {
                const singleOrderVal = todayOrderData[idx];
                chartData = JSON.parse(JSON.stringify(
                    this.updateSingleOrderTicketBoxOfficeForPercentChartData(chartData, singleOrderVal.ticketList)
                ));
            };
            console.log('佔比圖表資料:', chartData);

            // 拿掉前端不需要的欄位
            for (let idx = 0; idx < chartData.length; idx++) {
                let obj = chartData[idx];
                delete obj.movieId;
            };
        };

        console.log('(已過濾)票房收入佔比圖表資料:', chartData);
        return chartData;
    }



    // 票房收入(佔比)- 更新單一訂單的票券統計
    updateSingleOrderTicketBoxOfficeForPercentChartData(
        originalChartData: ManagerDashboardBoxOfficePercentChartData[],
        ticketList: StaffOrderCreateReqTicketList[]): ManagerDashboardBoxOfficePercentChartData[] {
        let newChartData: ManagerDashboardBoxOfficePercentChartData[] = JSON.parse(JSON.stringify(originalChartData));

        for (let idx = 0; idx < ticketList.length; idx++) {
            let singleTicketVal = ticketList[idx];
            let targetMovieIdx = newChartData ? newChartData.findIndex(val => val.movieId === singleTicketVal.movieId) : null;

            if ((targetMovieIdx === 0) || targetMovieIdx) {
                // 圖表資料已有該電影
                newChartData[targetMovieIdx].value += singleTicketVal.price;

            } else {
                // 圖表資料第一次新增該電影
                let obj = {
                    movieId: singleTicketVal.movieId,
                    name: "",
                    value: singleTicketVal.price
                };

                console.log('第一次新增', obj);
                newChartData.push(obj);
            };
        }

        console.log('更新單一訂單的票券統計', newChartData);
        return newChartData;
    }



    // 票房收入- 取得排行圖表資料
    getBoxOfficeStatisticsRankChartData(percentChartData: ManagerDashboardBoxOfficePercentChartData[]): ManagerDashboardBoxOfficeRankChartData {
        let rankChartData: ManagerDashboardBoxOfficeRankChartData = { name: [], value: [] };

        for (let idx = 0; idx < percentChartData.length; idx++) {
            const val = percentChartData[idx];
            rankChartData.name.push(val.name);
            rankChartData.value.push(val.value);
        };

        console.log('排行圖表資料:', rankChartData);
        return rankChartData;
    }





    // ———————————————————————  共用  ———————————————————————
    // 共用- 取得當日訂單資料
    getRangeDateOrderData(startDate: string, endDate: string, next: NextFunction): Promise<StaffOrderCreateModel[]> {
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
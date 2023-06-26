import { Request, Response, NextFunction } from 'express';
import Order from '../../models/orderModels';
import Movie from '../../models/moviesModels';
import ErrorService from './../../service/error';
import { ManagerDashboardBoxOfficePercentChartData, ManagerDashboardBoxOfficeRankChartData } from 'src/interface/manager';
import { StaffOrderCreateModel } from 'src/interface/staff/staffOrderModel';
import { StaffOrderCreateReqTicketList } from 'src/interface/swagger-model/staffOrderCreateReqTicketList';
import { DashboardMetricSuccess } from 'src/interface/swagger-model/dashboardMetricSuccess';
import { DashboardBoxOfficeChartSuccess } from 'src/interface/swagger-model/dashboardBoxOfficeChartSuccess';
const moment = require('moment');

class DashboardController {

    constructor() {

    }

    getMetric = async (req: Request<{}, DashboardMetricSuccess, {}, string, {}>, res: Response, next: NextFunction) => {
        if (!req?.query['searchDate']) {
            return next(ErrorService.appError(401, "請輸入查詢日期！", next));
        };

        let metricData = {};                                                                        // 要回傳client端的資料
        console.log('getMetric')
        try {
            let searchDate = moment(req.query['searchDate']).format('YYYY/MM/DD');
            metricData["dailyIncome"] = await this.getMetricOfDailyIncome(searchDate, next);            // 本日累計營收

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
    async getMetricOfDailyIncome(searchDate: string, next: NextFunction) {
        // 取得日期
        let today: string = searchDate;
        let lastDay: string = moment(today, 'YYYY/MM/DD').subtract(1, 'days').format('YYYY/MM/DD');

        // 取得訂單資料
        let todayOrderData = await this.getRangeDateOrderData(today, today, next);
        let lastDayOrderData = await this.getRangeDateOrderData(lastDay, lastDay, next);
        console.log('todayOrderData', todayOrderData, 'lastDayOrderData', lastDayOrderData);

        // 計算指標
        let todayIncome = this.getOneDayTotalIncome(todayOrderData as any);
        let lastDayIncome = this.getOneDayTotalIncome(lastDayOrderData as any);
        let increasePercent = (todayIncome / lastDayIncome);
        let formatIncreasePercent = (increasePercent * 100).toFixed(0);
        console.log('todayIncome', todayIncome, 'formatIncreasePercent', formatIncreasePercent);

        return {
            total: todayIncome,
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
    getBoxOfficeStatistics = async (req: Request<{}, DashboardBoxOfficeChartSuccess, {}, string, {}>, res: Response, next: NextFunction) => {
        if (!req?.query['searchDate']) {
            return next(ErrorService.appError(401, "請輸入查詢日期！", next));
        };

        let resData = { percentChartData: [], rankChartData: null };
        let searchDate: string = moment(req.query['searchDate']).format('YYYY/MM/DD');
        let todayOrderData = [];

        // 取得訂單資料
        try {
            todayOrderData = await this.getRangeDateOrderData(searchDate, searchDate, next);
            console.log('todayOrderData', todayOrderData);

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: `取得本日累計營收的訂單資料時發生錯誤:${err.message}`,
            });
        };



        // 取得圖表資料並回傳client端
        try {
            if (todayOrderData?.length) {
                resData.percentChartData = await this.getBoxOfficeStatisticsPercentChartData(todayOrderData) as any;     // 票房佔比
                resData.rankChartData = await this.getBoxOfficeStatisticsRankChartData(resData.percentChartData);        // 票行排行
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
    async getBoxOfficeStatisticsPercentChartData(todayOrderData: StaffOrderCreateModel[]): Promise<ManagerDashboardBoxOfficePercentChartData[]> {
        let chartData: ManagerDashboardBoxOfficePercentChartData[] = [];

        if (todayOrderData?.length) {
            // 取得圖表資料
            for (let idx = 0; idx < todayOrderData.length; idx++) {
                const singleOrderVal = todayOrderData[idx];
                console.log('singleOrderVal', singleOrderVal);
                chartData = JSON.parse(JSON.stringify(
                    this.updateSingleOrderTicketBoxOfficeForPercentChartData(chartData, singleOrderVal.ticketList)
                ));
            };
            console.log('佔比圖表資料:', chartData);

            // 拿掉前端不需要的欄位
            for (let idx = 0; idx < chartData.length; idx++) {
                let obj = chartData[idx];
                let movieData = await Movie.findById(obj.movieId);
                obj.name = (movieData.title as string);
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
        console.log('newChartData', newChartData, 'ticketList', ticketList);
        for (let idx = 0; idx < ticketList.length; idx++) {
            let singleTicketVal = ticketList[idx];
            let targetMovieIdx = newChartData ? newChartData.findIndex(val => val.movieId === singleTicketVal.movieId.toString()) : null;
            console.log('targetMovieIdx', targetMovieIdx)
            if (targetMovieIdx > -1) {
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
    async getRangeDateOrderData(startDate: string, endDate: string, next: NextFunction) {
        const _startDate = moment(startDate, "YYYY/MM/DD").startOf('day').add(8, 'hours').toISOString();
        const _endDate = moment(endDate, "YYYY/MM/DD").endOf('day').add(8, 'hours').toISOString();

        const searchCondition = {
            createdAt: {
                $gte: new Date(_startDate),
                $lte: new Date(_endDate),
            },
        };

        const orderData = await Order.find(searchCondition);

        return orderData;
    }

}



export default new DashboardController();
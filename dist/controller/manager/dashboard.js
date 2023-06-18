"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderModels_1 = __importDefault(require("../../models/orderModels"));
const moviesModels_1 = __importDefault(require("../../models/moviesModels"));
const error_1 = __importDefault(require("./../../service/error"));
const moment = require('moment');
class DashboardController {
    constructor() {
        this.getMetric = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!(req === null || req === void 0 ? void 0 : req.query['searchDate'])) {
                return next(error_1.default.appError(401, "請輸入查詢日期！", next));
            }
            ;
            let metricData = {};
            console.log('getMetric');
            try {
                let searchDate = moment(req.query['searchDate']).format('YYYY/MM/DD');
                metricData["dailyIncome"] = yield this.getMetricOfDailyIncome(searchDate, next);
                res.status(200).json({
                    code: 1,
                    message: '成功取得指標！',
                    data: metricData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || '取得指標失敗(其他)！',
                });
            }
            ;
        });
        this.getBoxOfficeStatistics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!(req === null || req === void 0 ? void 0 : req.query['searchDate'])) {
                return next(error_1.default.appError(401, "請輸入查詢日期！", next));
            }
            ;
            let resData = { percentChartData: [], rankChartData: null };
            let searchDate = moment(req.query['searchDate']).format('YYYY/MM/DD');
            let todayOrderData = [];
            try {
                todayOrderData = yield this.getRangeDateOrderData(searchDate, searchDate, next);
                console.log('todayOrderData', todayOrderData);
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: `取得本日累計營收的訂單資料時發生錯誤:${err.message}`,
                });
            }
            ;
            try {
                if (todayOrderData === null || todayOrderData === void 0 ? void 0 : todayOrderData.length) {
                    resData.percentChartData = (yield this.getBoxOfficeStatisticsPercentChartData(todayOrderData));
                    resData.rankChartData = yield this.getBoxOfficeStatisticsRankChartData(resData.percentChartData);
                }
                ;
                res.status(200).json({
                    code: 1,
                    message: '成功取得票房收入圖表資料！',
                    data: resData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: `取得票房收入圖表資料失敗(其他)！:${err.message}`,
                });
            }
            ;
        });
    }
    getMetricOfDailyIncome(searchDate, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let today = searchDate;
            let lastDay = moment(today, 'YYYY/MM/DD').subtract(1, 'days').format('YYYY/MM/DD');
            let todayOrderData = yield this.getRangeDateOrderData(today, today, next);
            let lastDayOrderData = yield this.getRangeDateOrderData(lastDay, lastDay, next);
            console.log('todayOrderData', todayOrderData, 'lastDayOrderData', lastDayOrderData);
            let todayIncome = this.getOneDayTotalIncome(todayOrderData);
            let lastDayIncome = this.getOneDayTotalIncome(lastDayOrderData);
            let increasePercent = (todayIncome / lastDayIncome);
            let formatIncreasePercent = (increasePercent * 100).toFixed(0);
            console.log('todayIncome', todayIncome, 'formatIncreasePercent', formatIncreasePercent);
            return {
                total: todayIncome,
                increasePercent: formatIncreasePercent
            };
        });
    }
    getOneDayTotalIncome(orderData) {
        let total = 0;
        if (orderData === null || orderData === void 0 ? void 0 : orderData.length) {
            for (const data of orderData) {
                total += data.amount;
            }
            ;
        }
        ;
        console.log('取得當日收入', total);
        return total;
    }
    getBoxOfficeStatisticsPercentChartData(todayOrderData) {
        return __awaiter(this, void 0, void 0, function* () {
            let chartData = [];
            if (todayOrderData === null || todayOrderData === void 0 ? void 0 : todayOrderData.length) {
                for (let idx = 0; idx < todayOrderData.length; idx++) {
                    const singleOrderVal = todayOrderData[idx];
                    console.log('singleOrderVal', singleOrderVal);
                    chartData = JSON.parse(JSON.stringify(this.updateSingleOrderTicketBoxOfficeForPercentChartData(chartData, singleOrderVal.ticketList)));
                }
                ;
                console.log('佔比圖表資料:', chartData);
                for (let idx = 0; idx < chartData.length; idx++) {
                    let obj = chartData[idx];
                    let movieData = yield moviesModels_1.default.findById(obj.movieId);
                    obj.name = movieData.title;
                    delete obj.movieId;
                }
                ;
            }
            ;
            console.log('(已過濾)票房收入佔比圖表資料:', chartData);
            return chartData;
        });
    }
    updateSingleOrderTicketBoxOfficeForPercentChartData(originalChartData, ticketList) {
        let newChartData = JSON.parse(JSON.stringify(originalChartData));
        console.log('newChartData', newChartData, 'ticketList', ticketList);
        for (let idx = 0; idx < ticketList.length; idx++) {
            let singleTicketVal = ticketList[idx];
            let targetMovieIdx = newChartData ? newChartData.findIndex(val => val.movieId === singleTicketVal.movieId.toString()) : null;
            console.log('targetMovieIdx', targetMovieIdx);
            if (targetMovieIdx > -1) {
                newChartData[targetMovieIdx].value += singleTicketVal.price;
            }
            else {
                let obj = {
                    movieId: singleTicketVal.movieId,
                    name: "",
                    value: singleTicketVal.price
                };
                console.log('第一次新增', obj);
                newChartData.push(obj);
            }
            ;
        }
        console.log('更新單一訂單的票券統計', newChartData);
        return newChartData;
    }
    getBoxOfficeStatisticsRankChartData(percentChartData) {
        let rankChartData = { name: [], value: [] };
        for (let idx = 0; idx < percentChartData.length; idx++) {
            const val = percentChartData[idx];
            rankChartData.name.push(val.name);
            rankChartData.value.push(val.value);
        }
        ;
        console.log('排行圖表資料:', rankChartData);
        return rankChartData;
    }
    getRangeDateOrderData(startDate, endDate, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const _startDate = moment(startDate, "YYYY/MM/DD").startOf('day').add(8, 'hours').toISOString();
            const _endDate = moment(endDate, "YYYY/MM/DD").endOf('day').add(8, 'hours').toISOString();
            const searchCondition = {
                createdAt: {
                    $gte: new Date(_startDate),
                    $lte: new Date(_endDate),
                },
            };
            const orderData = yield orderModels_1.default.find(searchCondition);
            return orderData;
        });
    }
}
exports.default = new DashboardController();

const express = require('express');
const router = express.Router();
import SeatController from '../../../controller/staff/seat.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

// 檢查座位是否有被鎖住
router.post('/checkLock', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(SeatController.seatCheckLock));
// 取得場次座位表
router.get('/:scheduleId', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(SeatController.getScheduleIdSeat));
// 更新座位狀態
router.patch('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(SeatController.updateSeatStatus))

export const StaffSeatRouter = router;
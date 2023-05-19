const express = require('express');
const router = express.Router();
import SeatController from '../../../controller/staff/seatController';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 檢查座位是否有被鎖住
router.post('/checkLock', AuthService.isEmpAuth, ErrorService.handleErrorAsync(SeatController.seatCheckLock));

router.get('/:scheduleId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(SeatController.getScheduleIdSeat));

export const StaffSeaRouter = router;
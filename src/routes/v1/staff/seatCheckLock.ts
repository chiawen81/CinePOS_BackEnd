const express = require('express');
const router = express.Router();
import SeatCheckLockController from '../../../controller/staff/ceatCheckLockController';
import ErrorService from '../../../service/error';


// 檢查座位是否有被鎖住
router.post('/', ErrorService.handleErrorAsync(SeatCheckLockController.seatCheckLock));


export const StaffSeatCheckLockRouter = router;
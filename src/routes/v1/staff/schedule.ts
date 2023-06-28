const express = require('express');
const router = express.Router();
import ScheduleController from '../../../controller/staff/schedule.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

/**場次查詢 */
router.get('/list', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(ScheduleController.getScheduleList));

export const StaffScheduleRouter = router;


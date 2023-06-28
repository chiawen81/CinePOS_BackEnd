const express = require('express');
const router = express.Router();
import TicketTypeController from '../../../controller/staff/ticketType.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

// 取得票種
router.get('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TicketTypeController.getTicketType));

// // 新增票種(單筆)
router.post('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TicketTypeController.createTicketType));


export const StaffTicketTypeRouter = router;    
const express = require('express');
const router = express.Router();
import TicketController from '../../../controller/staff/ticket.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

// 新增電影票(多筆)
router.post('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TicketController.createTicket));
// 更新電影票狀態(可多筆)
router.patch('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TicketController.updateTicketStatus));
// 刪除電影票(可多筆)
router.delete('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TicketController.deleteTicket));

export const StaffTicketRouter = router;    
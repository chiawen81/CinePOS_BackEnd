const express = require('express');
const router = express.Router();
import TicketController from '../../../controller/staff/ticket.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';



// 新增電影票(多筆)
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TicketController.createTicket));
// 更新電影票狀態(可多筆)
router.patch('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TicketController.updateTicketStatus));
// 刪除電影票(可多筆)
router.delete('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TicketController.deleteTicket));

export const StaffTicketRouter = router;    
const express = require('express');
const router = express.Router();
import TicketController from '../../../controller/staff/ticket.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';



// // 新增電影票(多筆)
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TicketController.createTicket));


export const StaffTicketRouter = router;    
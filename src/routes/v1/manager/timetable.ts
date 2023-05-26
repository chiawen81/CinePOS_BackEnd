import ErrorService from '../../../service/error';
// import AuthService from '../../../service/auth';
import TimetableController from '../../../controller/common/timetable';
const express = require('express');
const router = express.Router();


// router.get('/list',AuthService.isEmpAuth,ErrorService.handleErrorAsync(TimetableController.getList));
// router.post('/create',AuthService.isEmpAuth,ErrorService.handleErrorAsync(TimetableController.create));
// router.patch('/update',AuthService.isEmpAuth,ErrorService.handleErrorAsync(TimetableController.update));
// router.delete('/:timetableId',AuthService.isEmpAuth,ErrorService.handleErrorAsync(TimetableController.delete));
router.get('/list',ErrorService.handleErrorAsync(TimetableController.getList));
router.post('/create',ErrorService.handleErrorAsync(TimetableController.create));
router.patch('/update',ErrorService.handleErrorAsync(TimetableController.update));
router.delete('/:timetableId',ErrorService.handleErrorAsync(TimetableController.delete));


router.options('*', async (req, res) => {
    res.status(200).end();
});

router.all('*', (req, res) => {
    res.status(404).json({
        "status": "false",
        "message": "無此網站路由",
    })
});

// module.exports = router;
export const TimetableIndexRouter = router;
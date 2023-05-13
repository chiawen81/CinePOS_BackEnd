import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import TimetableController from '../../../controller/common/timetable';
const express = require('express');
const router = express.Router();


// router.get('/list',AuthService.isAuth,ErrorService.handleErrorAsync(TimetableController.getList));
router.get('/list',ErrorService.handleErrorAsync(TimetableController.getList));
// router.post('/create',AuthService.isAuth,ErrorService.handleErrorAsync(TimetableController.create));
// router.patch('/update',AuthService.isAuth,ErrorService.handleErrorAsync(TimetableController.update));
router.patch('/update',ErrorService.handleErrorAsync(TimetableController.update));
router.delete('/:timetableId',AuthService.isAuth,ErrorService.handleErrorAsync(TimetableController.delete));

// router.patch('/posts/:id', async (req, res) => {
//     try {
//         const data = req.body;
//         const id = req.params.id;
//         const posts = await Timetable.findByIdAndUpdate(id, data, { new: true });
//         if (posts === null) {
//             res.status(404).json({ status: 'false', message: '無此網站路由或id' });
//         } else {
//             res.status(200).json({
//                 status: "success",
//                 posts: posts
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ status: 'false', message: '發生錯誤' });
//     }
// });


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
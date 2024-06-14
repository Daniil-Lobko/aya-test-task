import { Router } from 'express';
import taskController from '../../controllers/task.controller';
import { errorWrapper } from '../../middlewares/error.wrapper';

const router: Router = Router();

router.post('/fill', errorWrapper(taskController.fillDatabase.bind(taskController)));
router.get('/rewards', errorWrapper(taskController.calculateReward.bind(taskController)));

export default router;

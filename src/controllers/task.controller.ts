import { TaskService } from '../services/task.service';

class TaskController {
  constructor(private readonly taskService: TaskService) {}
  async fillDatabase(_req: Request, res: Response) {
    const status = await this.taskService.fillDatabase();
    return status
      ? res.status(200).json({ message: 'Successful filling of DB' })
      : res.status(400).json({ message: 'Failed filling of DB' });
  }

  async calculateReward(_req: Request, res: Response) {
    const rewards = await this.taskService.calculateReward();
    return rewards ? res.status(200).json(rewards) : res.status(400).json({ message: 'Failed filling of DB' });
  }
}

export default new TaskController(new TaskService());

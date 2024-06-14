import { Application } from 'express';
import taskRouter from './api/task.route';

class AppRouter {
  constructor(private app: Application) {}

  init() {
    this.app.get('/', (_, res) => {
      res.status(200).json('Success response');
    });
    this.app.use('/api/task', taskRouter);
  }
}

export default AppRouter;

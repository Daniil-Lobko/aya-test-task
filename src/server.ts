import express from 'express';
import AppRouter from './routes/routes';

const app = express();
const router = new AppRouter(app);

router.init();

export default app;

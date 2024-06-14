import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import app from './server';

dotenv.config();
const { PORT, HOST } = process.env;

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

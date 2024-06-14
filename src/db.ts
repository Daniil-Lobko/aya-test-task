import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aya',
  password: '1121',
  port: 5432,
});

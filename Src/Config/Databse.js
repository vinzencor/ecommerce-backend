import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();    
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER ,
    host: process.env.DB_HOST ,
    database: process.env.DB_NAME ,
    password: process.env.DB_PASSWORD ,
    port: Number(process.env.DB_PORT),
    max: Number(process.env.DB_POOL_MAX) || 20,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5000,
});

pool
  .connect()
  .then((client) => {
    console.log(` PostgreSQL Connected Successfully to:${process.env.DB_HOST} ${process.env.DB_NAME}`);
    client.release();
  })
  .catch((err) => console.error(" DB Connection Failed:", err));

export default pool;

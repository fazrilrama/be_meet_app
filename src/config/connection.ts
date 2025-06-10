import mysql = require('mysql2/promise');
import * as dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user:  process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'scret',
    database: process.env.DB_NAME || 'meet',
    port: 33060,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function query(sql: string, params?: any[]) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

export async function query_transaction(sql: string, params?: any[]) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
  
      const [result]: any = await conn.query(sql, params); // result = ResultSetHeader
  
      await conn.commit();
      return result;
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

export async function transaction<T>(callback: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export { pool };

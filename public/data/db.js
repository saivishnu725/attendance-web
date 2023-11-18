import mariadb from "mariadb";
import { config } from "dotenv";
config();

//creating a connection pool
export const pool = mariadb.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// create a connection using the pool
const getConnection = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, connection);
  });
};

// perform a query on the database and return the result
const query = (sql, params, callback) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else
        connection.query(sql, params, (error, results) => {
          connection.release();
          if (error) reject(error);
          else resolve(results);
        });
    });
  });
};

export { query };

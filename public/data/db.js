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
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, connection);
    });
  } catch (error) {
    console.error(`Error getting connection: ${error}`);
  }
};

// perform a query on the database and return the result
const query = (sql, params, callback) => {
  try {
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
  } catch (error) {
    console.error(`Error querying database: ${error}`);
  }
};

export { query };

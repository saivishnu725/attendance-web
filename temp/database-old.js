import mariadb from "mariadb";
import { config } from "dotenv";
config();

//creating a connection pool
const pool = mariadb.createPool({
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
  console.log("querying");
  return new Promise((resolve, reject) => {
    console.log("promise");
    pool.getConnection((err, connection) => {
      console.log("connection");
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

// get userID
const getUserID = async (email) => {
  const result = await query("SELECT UserID FROM Users WHERE Email = ?", [
    email,
  ]);
  return result[0].UserID;
};

// get userID
const getUserName = async (userID) => {
  const result = await query("SELECT Username FROM Users WHERE UserID = ?", [
    userID,
  ]);
  return result[0].UserID;
};

const getUserData = async (userID) => {
  console.log("getting user data");
  const result = await query(
    "SELECT UserID, Username, Email, FirstName, LastName, UpdatedAt FROM Users WHERE UserID = ?",
    userID
  );
  console.log("yes", result[0]);
  return result[0];
};

const getClassNames = async (userID) => {
  const result = await query(
    "SELECT ClassName FROM Classes WHERE UserID = ?",
    userID
  );
  return result;
};

export { query, getUserID, getUserData, getUserName, getClassNames };

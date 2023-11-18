import { pool } from "./db.js";
import bcrypt from "bcrypt";

// get userID
export const getUserID = async (email) => {
  let conn = await pool.getConnection();
  const result = await conn.query("SELECT UserID FROM Users WHERE Email = ?", [
    email,
  ]);
  console.log("inside getUserID: ", result);
  return result[0];
};

// get userName
export const getUserName = async (userID) => {
  let conn = await pool.getConnection();

  const result = await conn.query(
    "SELECT Username FROM Users WHERE UserID = ?",
    [userID]
  );
  return result[0].Username;
};

// getUserData
export const getUserData = async (userID) => {
  let conn = await pool.getConnection();
  console.log("getting user data: ", userID);
  const result = await conn.query(
    "SELECT UserID, Username, Email, FirstName, LastName FROM Users WHERE UserID = ?",
    [userID]
  );
  console.log("inside getUserData: ", result);
  return result[0];
};

// check if user exists using email
export const checkUserExists = async (email) => {
  let conn = await pool.getConnection();
  console.log("checking if user exists");
  const queryResult = await conn.query(
    "SELECT * FROM Users WHERE Username = ? OR Email = ?",
    [email, email]
  );
  return queryResult.length > 0;
};

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const createUser = async (
  username,
  email,
  password,
  firstName,
  lastName
) => {
  console.log("creating user");
  let conn = await pool.getConnection();
  const hashedPassword = await hashPassword(password);
  console.log(password, " + ", hashedPassword);
  const currentDate = new Date();
  const queryResult = await conn.query(
    "INSERT INTO Users (Username, PasswordHash, Email, FirstName, LastName, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [username, hashedPassword, email, firstName, lastName, currentDate]
  );
  return queryResult;
};

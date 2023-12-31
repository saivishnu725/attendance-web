import { pool } from "./db.js";
import bcrypt from "bcrypt";

// get userID
export const getUserID = async (email) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT UserID FROM Users WHERE Email = ?",
      [email]
    );
    console.log("inside getUserID: ", result);
    return result[0];
  } catch (error) {
    console.error("Error getting user ID: ", error);
  } finally {
    if (conn) conn.release();
  }
};

// get userName
export const getUserName = async (userID) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      "SELECT Username FROM Users WHERE UserID = ?",
      [userID]
    );
    return result[0].Username;
  } catch (error) {
    console.error("Error getting user name: ", error);
  } finally {
    if (conn) conn.release();
  }
};

// getUserData
export const getUserData = async (userID) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("getting user data: ", userID);
    const result = await conn.query(
      "SELECT UserID, Username, Email, FirstName, LastName, CreatedAt, UpdatedAt FROM Users WHERE UserID = ?",
      [userID]
    );
    console.log("inside getUserData: ", result);
    return result[0];
  } catch (error) {
    console.error("Error getting user data: ", error);
  } finally {
    if (conn) conn.release();
  }
};

// check if user exists using email
export const checkUserExists = async (email) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("checking if user exists");
    const queryResult = await conn.query(
      "SELECT * FROM Users WHERE Username = ? OR Email = ?",
      [email, email]
    );
    return queryResult.length > 0;
  } catch (error) {
    console.error("Error checking if user exists: ", error);
  } finally {
    if (conn) conn.release();
  }
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
  let conn;
  try {
    conn = await pool.getConnection();
    const hashedPassword = await hashPassword(password);
    console.log(password, " + ", hashedPassword);
    const currentDate = new Date();
    const queryResult = await conn.query(
      "INSERT INTO Users (Username, PasswordHash, Email, FirstName, LastName, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [username, hashedPassword, email, firstName, lastName, currentDate]
    );
    return queryResult;
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    if (conn) conn.release();
  }
};

// verify user
export const verifyUser = async (email, password) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT PasswordHash FROM Users WHERE Email = ? OR Username = ?",
      [email, email]
    );
    console.log("verifyUser: ", result);
    const hashedPassword = result[0].PasswordHash;
    console.log("hashedPassword: ", hashedPassword);
    const match = await bcrypt.compare(password, hashedPassword);
    console.log("match: ", match);
    return match;
  } catch (error) {
    console.error("Error verifying user: ", error);
  } finally {
    if (conn) conn.release();
  }
};

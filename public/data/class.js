import { pool } from "./db.js";

export const getClassData = async (userID) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    "SELECT ClassName, ClassID FROM Classes WHERE UserID = ?",
    userID
  );
  console.log("inside getClassData: ", result);
  return result;
};

export const createClass = async (
  userID,
  className,
  TotalClassesAttended,
  TotalClassesTaken,
  StartDate
) => {
  console.log("Creating class");
  if (StartDate == null) StartDate = new Date().toISOString().slice(0, 10);
  const conn = await pool.getConnection();
  const result = await conn.query(
    "INSERT INTO Classes (UserID, ClassName, TotalClassesAttended, TotalClassesTaken, StartDate) VALUES (?, ?, ?, ?, ?)",
    [userID, className, TotalClassesAttended, TotalClassesTaken, StartDate]
  );
  console.log("inside createClass: ", result);
  return result;
};

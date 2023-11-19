import { pool } from "./db.js";

export const getClassData = async (userID) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    "SELECT ClassName, ClassID, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage FROM Classes WHERE UserID = ?",
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

export const updateClass = async (classID, status) => {
  /*
  status -> present
        attended++
        taken++
  status -> absent
        taken++
  */
  const conn = await pool.getConnection();
  let result;
  if (status == "present") {
    result = await conn.query(
      "UPDATE Classes SET TotalClassesTaken = TotalClassesTaken + 1, TotalClassesAttended = TotalClassesAttended + 1 WHERE ClassID = ?",
      [classID]
    );
  } else {
    result = await conn.query(
      "UPDATE Classes SET TotalClassesTaken = TotalClassesTaken + 1 WHERE ClassID = ?",
      [classID]
    );
  }
  console.log("inside updateClass: ", result);
  return result;
};

export const deleteClass = async (classID) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Classes WHERE ClassID = ?", [
      classID,
    ]);
    console.log("inside deleteClass: ", result);
    return result;
  } catch (error) {
    console.error("Error deleting class: ", error);
    return "no delete";
  }
};

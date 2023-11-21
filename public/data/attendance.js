import { pool } from "./db.js";

export const setAttendance = async (classID, userID, status, skipReason) => {
  try {
    const conn = await pool.getConnection();
    const classInfo = await conn.query(
      `SELECT ClassName, TotalClassesAttended, TotalClassesTaken, Percentage FROM Classes WHERE ClassID = ?`,
      [classID]
    );

    let Percentage =
      (classInfo[0].TotalClassesAttended / classInfo[0].TotalClassesTaken) *
      100;
    const result = await conn.query(
      `INSERT INTO AttendanceLog (UserID, ClassID, ClassName, Status, SkipReason, totalClassAttended, totalClassTaken, Percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userID,
        classID,
        classInfo[0].ClassName,
        status,
        skipReason,
        classInfo[0].TotalClassesAttended,
        classInfo[0].TotalClassesTaken,
        Percentage,
      ]
    );

    return result;
  } catch (error) {
    console.error(`Error setting attendance: ${error}`);
  }
};

export const getAttendance = async (userID) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM Attendance WHERE UserID = ?`,
      [userID]
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error getting attendance: ${error}`);
  }
};

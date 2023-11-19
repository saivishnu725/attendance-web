import { pool } from "./db.js";

export const setAttendance = async (classID, userID, status, skipReason) => {
  const conn = await pool.getConnection();
  const currentDate = new Date().toISOString().slice(0, 10); // get currentDate in "2023-01-01" format

  const classInfo = await conn.query(
    `SELECT TotalClassesAttended, TotalClassesTaken, Percentage FROM Classes WHERE ClassID = ?`,
    [classID]
  );

  const result = await conn.query(
    `INSERT INTO AttendanceLog (UserID, ClassID, Status, SkipReason, totalClassAttended, totalClassTaken, Percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userID,
      classID,
      status,
      skipReason,
      classInfo[0].TotalClassesAttended,
      classInfo[0].TotalClassesTaken,
      classInfo[0].Percentage,
    ]
  );

  return result;
};

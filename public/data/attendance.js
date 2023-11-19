import { pool } from "./db.js";

export const setAttendance = async (classID, userID, status, skipReason) => {
  console.log(
    "setAttendance: ",
    classID,
    " ",
    userID,
    " ",
    status,
    " ",
    skipReason
  );
  const conn = await pool.getConnection();
  const currentDate = new Date().toISOString().slice(0, 10); // get currentDate in "2023-01-01" format
  const result = await conn.query(
    `INSERT INTO AttendanceLog (UserID, ClassID, Status, SkipReason)
    VALUES (?, ?, ?, ?)`,
    [userID, classID, status, skipReason]
  );
  console.log("inside setAttendance: ", result);
  return result;
};

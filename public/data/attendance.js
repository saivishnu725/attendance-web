import { pool } from "./db.js";

export const setAttendance = async (classID, userID, status, skipReason) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const classInfo = await conn.query(
      `SELECT ClassName, TotalClassesAttended, TotalClassesTaken, Percentage FROM Classes WHERE ClassID = ?`,
      [classID]
    );

    let Percentage =
      (classInfo[0].TotalClassesAttended / classInfo[0].TotalClassesTaken) *
      100;
    const result = await conn.query(
      `INSERT INTO AttendanceLog (UserID, ClassID, ClassName, Status, SkipReason, TotalClassAttended, TotalClassTaken, Percentage)
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
  } finally {
    if (conn) conn.release();
  }
};

export const getAttendance = async (userID) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM Attendance WHERE UserID = ?`,
      [userID]
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error getting attendance: ${error}`);
  } finally {
    if (conn) conn.release();
  }
};

// delete an attendance
//  not working atm
export const deleteAttendance = async (attendanceID) => {
  let conn;
  try {
    conn = await pool.getConnection();

    // Get the status of the attendance being deleted
    const attendance = await conn.query(
      `SELECT Status, totalClassAttended, totalClassTaken FROM AttendanceLog WHERE AttendanceID = ?`,
      [attendanceID]
    );

    const ClassID = await conn.query(
      `SELECT ClassID FROM AttendanceLog WHERE AttendanceID = ?`,
      [attendanceID]
    );

    // Delete the attendance
    const result = await conn.query(
      `DELETE FROM AttendanceLog WHERE AttendanceID = ?`,
      [attendanceID]
    );

    // Reduce TotalClassesTaken in AttendanceLog and Classes tables
    await conn.query(
      `UPDATE AttendanceLog SET totalClassTaken = totalClassTaken - 1 WHERE AttendanceID = ?`,
      [attendanceID]
    );
    await conn.query(
      `UPDATE Classes SET TotalClassesTaken = TotalClassesTaken - 1 WHERE ClassID = ?`,
      [ClassID]
    );

    // If the status of the attendance was 'present', reduce TotalClassesAttended
    if (attendance[0].Status === "present") {
      await conn.query(
        `UPDATE AttendanceLog SET totalClassAttended = totalClassAttended - 1 WHERE AttendanceID = ?`,
        [attendanceID]
      );
      await conn.query(
        `UPDATE Classes SET TotalClassesAttended = TotalClassesAttended - 1 WHERE ClassID = ?`,
        [ClassID]
      );
    }

    // Recalculate the percentage and update both tables
    const newPercentage =
      (attendance[0].totalClassAttended / attendance[0].totalClassTaken) * 100;
    await conn.query(
      `UPDATE AttendanceLog SET Percentage = ? WHERE AttendanceID = ?`,
      [newPercentage, attendanceID]
    );
    await conn.query(`UPDATE Classes SET Percentage = ? WHERE ClassID = ?`, [
      newPercentage,
      ClassID,
    ]);

    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error deleting attendance: ${error}`);
  } finally {
    if (conn) conn.release();
  }
};

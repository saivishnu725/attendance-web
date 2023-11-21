import { pool } from "./db.js";

export const getClassData = async (userID) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT ClassName, ClassID, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage FROM Classes WHERE UserID = ?",
      userID
    );
    console.log("inside getClassData: ", result);
    return result;
  } catch (error) {
    console.error("Error getting class data: ", error);
  }
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
  console.log(
    userID,
    " ",
    className,
    " ",
    TotalClassesAttended,
    " ",
    TotalClassesTaken,
    " ",
    StartDate
  );
  let Percentage = (TotalClassesAttended / TotalClassesTaken) * 100;
  if (TotalClassesTaken == 0) Percentage = 0;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO Classes (UserID, ClassName, TotalClassesAttended, TotalClassesTaken, StartDate, Percentage) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userID,
        className,
        TotalClassesAttended,
        TotalClassesTaken,
        StartDate,
        Percentage,
      ]
    );
    console.log("inside createClass: ", result);
    return result;
  } catch (error) {
    console.error("Error creating class: ", error);
    return "no create";
  }
};

export const updateClass = async (classID, status) => {
  /*
  status -> present
        attended++
        taken++
  status -> absent
        taken++
  */
  try {
    const conn = await pool.getConnection();
    let result;
    if (status == "present") {
      result = await conn.query(
        "UPDATE Classes SET TotalClassesTaken = TotalClassesTaken + 1, TotalClassesAttended = TotalClassesAttended + 1 WHERE ClassID = ?",
        [classID]
      );
    } else if (status == "absent") {
      result = await conn.query(
        "UPDATE Classes SET TotalClassesTaken = TotalClassesTaken + 1 WHERE ClassID = ?",
        [classID]
      );
    }

    // update percentage
    updatePercentage(classID);

    console.log("inside updateClass: ", result);
    return result;
  } catch (error) {
    console.error("Error updating class: ", error);
    return "no update";
  }
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

// update Percentage in Classes table
export const updatePercentage = async function (classID) {
  try {
    const conn = await pool.getConnection();
    const data = await conn.query(
      `SELECT TotalClassesAttended, TotalClassesTaken FROM Classes WHERE ClassID = ?`,
      classID
    );
    console.log("inside updatePercentage: ", data);
    let Percentage =
      (data[0].TotalClassesAttended / data[0].TotalClassesTaken) * 100;
    console.log("Percentage: ", Percentage);
    const result = await conn.query(
      `UPDATE Classes SET Percentage = ? WHERE ClassID = ?`,
      [Percentage, classID]
    );
    console.log(`Rows updated: ${result.changes}`);
  } catch (error) {
    console.error(`Error updating percentage: ${error}`);
  }
};

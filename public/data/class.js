import { pool } from "./db.js";

export const getClassNames = async (userID) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    "SELECT ClassName FROM Classes WHERE UserID = ?",
    userID
  );
  console.log("inside getClassNames: ", result);
  return result;
};

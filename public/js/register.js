import { query } from "./database-old.js";
import bcrypt from "bcrypt";

const checkIfUserExists = async (username, email) => {
  const queryResult = await query(
    "SELECT * FROM Users WHERE Username = ? OR Email = ?",
    [username, email]
  );
  return queryResult.length > 0;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const createUser = async ({
  username,
  email,
  firstName,
  lastName,
  password,
}) => {
  const hashedPassword = await hashPassword(password);
  const currentDate = new Date();
  const queryResult = await query(
    "INSERT INTO Users (Username, PasswordHash, Email, FirstName, LastName, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      hashedPassword,
      email,
      firstName,
      lastName,
      currentDate,
      currentDate,
    ]
  );
  return queryResult;
};

export { checkIfUserExists, createUser };

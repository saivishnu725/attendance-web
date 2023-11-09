import { query } from "./database.js";
import bcrypt from "bcrypt";

const verifyUser = async (username, password, email, phone) => {
  username = "student1";
  password = "password1";
  const userResults = await query("SELECT * FROM Users WHERE Username = ?", [
    username,
  ]);
  const user = userResults[0];

  console.log(user.PasswordHash);
  console.log(password);
  const match = await bcrypt.compare(password, user.PasswordHash);
  console.log(match);
  return false;
};

export { verifyUser };

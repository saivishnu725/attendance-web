import { query } from "./database.js";
import bcrypt from "bcrypt";

const verifyUser = async (email, password) => {
  const userResults = await query("SELECT * FROM Users WHERE Email = ?", [
    email,
  ]);
  const user = userResults[0];
  if (user) {
    const match = await bcrypt.compare(password, user.PasswordHash);
    return match;
  }
};

export { verifyUser };

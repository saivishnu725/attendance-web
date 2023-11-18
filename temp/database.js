import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "mariadb",
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;

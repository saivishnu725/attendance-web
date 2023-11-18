import { db as data } from "./config/config.js";
import { Sequelize, DataTypes } from "sequelize";
import User from "./models/User.js";
import Class from "./models/Class.js";

const db = {};

data
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

db.Sequelize = Sequelize;
db.sequelize = data;

// user, classes
db.user = User(data, DataTypes);
db.classes = Class(data, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync with db.");
});

export default db;

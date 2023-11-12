// User.js
import { DataTypes } from "sequelize";
import { define } from "js/database";

const User = define("Users", {
  UserID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PasswordHash: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    defaultValue: 0,
  },
  FirstName: {
    type: DataTypes.STRING(100),
    defaultValue: 0,
  },
  LastName: {
    type: DataTypes.STRING(100),
    defaultValue: 0,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: new Date().getDate(),
    allowNull: false,
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: new Date().getDate(),
    allowNull: false,
  },
});

export default User;

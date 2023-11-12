// Class.js
import { DataTypes } from "sequelize";
import { define } from "js/database";
import User from "js/models/User";

const Class = define("Classes", {
  ClassID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClassName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TotalClassesAttended: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TotalClassesTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0, // Set a default value
  },
});

// Define a foreign key relationship
Class.belongsTo(User, {
  foreignKey: "UserID",
  as: "user", // Access the createdBy user as `class.user`
});

export default Class;

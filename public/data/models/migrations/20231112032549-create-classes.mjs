"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Classes", {
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
        references: {
          model: "User",
          key: "UserID",
        },
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
        defaultValue: Date.now(),
      },
      Percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0, // Set a default value
        get() {
          return Sequelize.literal(
            "TotalClassesAttended / TotalClassesTaken * 100"
          );
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Classes");
  },
};

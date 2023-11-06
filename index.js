//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { query } from "./public/js/database.js";

const app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// public folder
app.use(express.static("public"));

//data
const data_OLD = JSON.parse(fs.readFileSync("public/data/data.json", "utf8"));
// user data
const userData_OLD = JSON.parse(
  fs.readFileSync("public/data/user.json", "utf8")
);
// home page data
const homePageData = JSON.parse(
  fs.readFileSync("public/data/home.json", "utf8")
);

//path
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// use ejs
app.set("view engine", "ejs");

// get home page
app.get("/", async function (req, res) {
  const [data, userData, classesData] = await Promise.all([
    query("SELECT * FROM Users", []),
    query(
      `SELECT AttendanceRecords.*, Users.FirstName, Users.LastName, Classes.ClassName FROM AttendanceRecords
    INNER JOIN Users ON AttendanceRecords.UserID = Users.UserID
    INNER JOIN Classes ON AttendanceRecords.ClassID = Classes.ClassID
    ORDER BY AttendanceRecords.CreatedAt DESC`,
      []
    ),
    query("SELECT * FROM Classes", []),
  ]);

  res.render("home", {
    data: data_OLD,
    userData: userData_OLD,
    users: userData,
    homePageData: homePageData,
  });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

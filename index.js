//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { query } from "./public/js/database.js";
import { config } from "dotenv";
import session from "express-session";
config();

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

// use a session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !process.env.DEVELOPMENT }, // Set secure to true if using HTTPS
  })
);

//get home page              OLD
//temp home screen
app.get("/home", async function (req, res) {
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

//get home page
app.get("/", function (request, response) {
  if (request.session.user) response.render("home");
  else response.redirect("login");
});

//login page
app.get("/login", function (request, response) {
  if (request.session.user) response.redirect("home");
  else response.render("login");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

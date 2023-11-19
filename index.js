//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieSession from "cookie-session";
config();
import {
  verifyUser,
  getUserData,
  getUserID,
  checkUserExists,
  createUser,
} from "./public/data/user.js";
import {
  getClassData,
  updateClass,
  createClass,
  deleteClass,
} from "./public/data/class.js";
import { setAttendance, getAttendance } from "./public/data/attendance.js";

// express
const app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// public folder
app.use(express.static("public"));

//path
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// use ejs
app.set("view engine", "ejs");

// use a session
app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: !process.env.DEVELOPMENT, // Set secure to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
  })
);

//          Routes

// home
app.get("/", async function (req, res) {
  console.log(req.session.userID);
  if (req.session.userID) {
    console.log("inside home");
    const userID = req.session.userID.UserID;
    console.log("userID: ", userID);
    const userData = await getUserData(userID);
    console.log("userData: ", userData);
    const classNames = await getClassData(userID);
    const attendance = await getAttendance(userID);
    res.render("home", {
      user: userData,
      classes: classNames,
      attendance: attendance,
    });
  } else res.redirect("login");
});

// login
app.get("/login", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("login");
});

// post -> get data from login
app.post("/login", async function (req, res) {
  console.log("req.body", req.body);
  const { email, password } = req.body;
  if ((await checkUserExists(email)) && (await verifyUser(email, password))) {
    console.log("getUserID", await getUserID(email));
    req.session.userID = await getUserID(email);
    console.log(req.session.userID);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// register
app.get("/register", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("register");
});

// post -> get data from register
app.post("/register", async function (req, res) {
  console.log("req.body", req.body);
  const { username, email, password, firstName, lastName } = req.body;
  console.log(
    "register info: ",
    username,
    email,
    password,
    firstName,
    lastName
  );
  const user = await createUser(username, email, password, firstName, lastName);
  console.log("register done: ", user);
  // save user id in session cookie
  req.session.userID = await getUserID(email);
  res.redirect("/");
});

// post -> get form input for classNames and process it
app.post("/attendance-form", async function (req, res) {
  const checked = [];
  console.log("attendance body: ", req.body);
  const status = req.body["status"];
  const skipReason =
    req.body["skipReason"] === "" ? null : req.body["skipReason"];

  console.log("attendance status: ", req.body);
  for (const key in req.body) {
    if (req.body[key] === "on") checked.push(key);
  }
  console.log("Checked checkboxes: ", checked);
  const userID = req.session.userID.UserID;
  for (let item in checked) {
    console.log("item: ", item);
    let created = await setAttendance(
      checked[item],
      userID,
      status,
      skipReason
    );
    console.log(created);
    // change totalAttended and totalTaken in Classes table
    let updated = await updateClass(checked[item], status);
    console.log(updated);
  }
  res.redirect("/");
});

// logout
app.get("/logout", (req, res) => {
  console.log("logout");
  req.session = null;
  res.redirect("/login");
});

// timetable
app.get("/timetable", async function (req, res) {
  const userID = req.session.userID.UserID;
  const classNames = await getClassData(userID);
  console.log("classNames: ", classNames);
  res.render("timetable", { classes: classNames });
});

app.post("/create-class", async function (req, res) {
  const userID = req.session.userID.UserID;
  const { className, totalClassAttended, totalClassTaken, StartDate } =
    req.body;
  console.log("create-class: ", req.body);
  await createClass(
    userID,
    className,
    totalClassAttended,
    totalClassTaken,
    StartDate
  );
  res.redirect("/timetable");
});

app.post("/delete-class", async function (req, res) {
  console.log("delete-class: ", req.body);
  const { classID } = req.body;
  console.log("classID: ", classID);
  let deleteResult = await deleteClass(classID);
  if (deleteResult == "no delete") console.log(deleteResult);
  res.redirect("/timetable");
});

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});

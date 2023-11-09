//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { config } from "dotenv";
import session from "express-session";
config();
import { query } from "./public/js/database.js";
import { verifyUser } from "./public/js/login.js";
import { checkIfUserExists, createUser } from "./public/js/register.js";

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
    cookie: {
      secure: !process.env.DEVELOPMENT, // Set secure to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }, // 30 days in milliseconds
  })
);

// get userID
const getUserId = async (email) => {
  const result = await query("SELECT UserID FROM Users WHERE Email = ?", [
    email,
  ]);
  return result[0].UserID;
};

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
app.get("/", function (req, res) {
  console.log(req.session.userID);
  if (req.session.userID) res.render("home");
  else res.redirect("login");
});

//login page
app.get("/login", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("login");
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const userExists = await verifyUser(email, password);
  if (userExists) {
    req.session.userID = await getUserId(email); // user.UserID => Store UserID in session
    res.redirect("/");
  } else
    res.send(`
  <p> The entered Email and Password doesn't exist or is incorrect!! Please enter valid credentials</p> <br \>
  <button onclick="window.history.back()">Go Back and Try again</button>`);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.send("Error while logging out");
    } else res.redirect("/login");
  });
});

// register page
app.get("/register", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("register");
});

// register post
app.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, email, repeatPassword } =
    req.body;
  try {
    const userExists = await checkIfUserExists(username, email);

    if (!userExists) {
      await createUser({
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      });
      req.session.userID = await getUserId(username);
      res.redirect("/");
    } else {
      alert(
        "User already exists! Try logging-in if it is your account. If not, try registering with a different username and email."
      );
      res.redirect("/register");
    }
  } catch (error) {
    console.error(error);
    res.send(`
    Error while registering. Try again later! <br \>
  <button onclick="window.history.back()">Go Back and Try again</button>`);
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

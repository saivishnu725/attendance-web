//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieSession from "cookie-session";
config();
import {
  getUserData,
  getUserID,
  getUserName,
  checkUserExists,
  createUser,
} from "./public/data/user.js";
import { getClassNames } from "./public/data/class.js";

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
    const classNames = await getClassNames(userID);
    res.render("home", { user: userData, classes: classNames });
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
  if (await checkUserExists(email)) {
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
  console.log(
    "register done: ",
    await createUser(username, email, password, firstName, lastName)
  );
  res.redirect("/");
});

// logout
app.get("/logout", (req, res) => {
  console.log("logout");
  req.session = null;
  res.redirect("/login");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

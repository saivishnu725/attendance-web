//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieSession from "cookie-session";
config();
import { verifyUser } from "./public/js/login.js";
import {
  createUser,
  getUser,
  getUserInfo,
  checkEmailExists,
  checkUsernameExists,
} from "./public/data/controllers/userController.js";
import {} from "./public/data/controllers/classController.js";
import { getUserData, getClassNames } from "./temp/database-old.js";
import { auth } from "./public/data/database.js";
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

// get user data
app.use(async (req, res, next) => {
  if (req.session.userID) {
    const userID = req.session.userID;
    // const userID = 1;
    const userData = await getUserData(userID);
    req.user = userData;
    const classNames = await getClassNames(userID);
    req.classNames = classNames;
  }
  auth();
  next();
});

// Routes

//home
app.get("/", async function (req, res) {
  const newUser = await createUser(
    {
      Username: "user_10",
      PasswordHash: "123456",
      Email: "user10@example.com",
      FirstName: "user",
      LastName: "10",
    },
    "res"
  );
  console.log(newUser);

  if (req.session.userID) {
    console.log(req.session.userID);
    res.render("home", { user: req.user, classes: req.classNames });
  } else res.redirect("login");
});

//login
app.get("/login", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("login");
});

// app.post("/login", async function (req, res) {
//   const { email, password } = req.body;
//   const userExists = await verifyUser(email, password);
//   if (userExists) {
//     req.session.userID = await getUserID(email); // user.UserID => Store UserID in session
//     res.redirect("/");
//   } else
//     res.send(`
//   <p> The entered Email and Password doesn't exist or is incorrect!! Please enter valid credentials</p> <br />
//   <button onclick="window.history.back()">Go Back and Try again</button>`);
// });

// logout
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// register
app.get("/register", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("register");
});

// check if user exists or not
// username
app.get("/check-username", async (req, res) => {
  const username = req.query.username;
  const userExists = await checkUsernameExists(username);
  res.json({ exists: userExists });
});
//email
app.get("/check-email", async (req, res) => {
  const email = req.query.email;
  const userExists = await checkEmailExists(email);
  res.json({ exists: userExists });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieSession from "cookie-session";
config();
import { getUserID, getUserData, getClassNames } from "./public/js/database-old.js";
import { verifyUser } from "./public/js/login.js";
import { checkIfUserExists, createUser } from "./public/js/register.js";

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
    const userData = await getUserData(userID);
    req.user = userData;
    const classNames = await getClassNames(userID);
    req.classNames = classNames;
  }
  next();
});

//get home page
app.get("/", function (req, res) {
  if (req.session.userID) {
    console.log(req.session.userID);
    res.render("home", { user: req.user, classes: req.classNames });
  } else res.redirect("login");
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
    req.session.userID = await getUserID(email); // user.UserID => Store UserID in session
    res.redirect("/");
  } else
    res.send(`
  <p> The entered Email and Password doesn't exist or is incorrect!! Please enter valid credentials</p> <br />
  <button onclick="window.history.back()">Go Back and Try again</button>`);
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// register page
app.get("/register", function (req, res) {
  if (req.session.userID) res.redirect("/");
  else res.render("register");
});

// register post
app.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;
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
      req.session.userID = await getUserID(username);
      res.redirect("/");
    } else {
      // TODO: Remove this from post method to a script that runs at client side.
      res.send(`
    <script>
    alert("User already exists! Try logging-in if it is your account. If not, try registering with a different username and email.");
    window.location.href = '/register';  // Redirect to a specific page after displaying the alert
    </script>`);
    }
  } catch (error) {
    console.error(error);
    res.send(`
    <script>
    alert("Error while registering. Try again later!");
    window.location.href = '/register';  // Redirect to a specific page after displaying the alert
    </script>`);
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// public folder
app.use(express.static("public"));

//data
const data = JSON.parse(fs.readFileSync("public/data/data.json", "utf8"));

//path
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// use ejs
app.set("view engine", "ejs");

// get home page
app.get("/", function (req, res) {
  res.render("home", { data: data });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

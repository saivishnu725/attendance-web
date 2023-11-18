import db from "../database.js";

const User = db.user;

// Create and Save a new User
export const createUser = async (req, res) => {
  // Validate request
  if (!req.body.Username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User
  const user = {  
    Username: req.body.Username,
    PasswordHash: req.body.PasswordHash,
    Email: req.body.Email,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
  };

  // Save User in the database
  await User.create(user)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error" + err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve a User info from the database based on the Username
export const getUser = async (req, res) => {
  const UserID = req.params.UserID;

  await User.findOne({ where: { UserID: UserID }, attributes: {} })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found User with Username " + Username });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving User with Username=" + Username });
    });
};

// Retrieve Username, FirstName, LasTName, Image path based on UserID from the database
export const getUserInfo = async (req, res) => {
  const UserID = req.params.UserID;

  await User.findOne({
    where: { UserID: UserID },
    attributes: ["Username", "FirstName", "LastName", "ImagePath"],
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found User with UserID " + UserID });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving User with UserID=" + UserID });
    });
};

// check if the given Username exists and return boolean value
export const checkUsernameExists = async (req, res) => {
  const Username = req.query.Username;

  await User.findOne({ where: { Username: Username } })
    .then((data) => {
      if (!data) {
        res.status(200).send({ exists: false });
      } else {
        res.status(200).send({ exists: true });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error checking Username" });
    });
};

// check if the given Email exists and return boolean value
export const checkEmailExists = async (req, res) => {
  const Email = req.query.Email;

  await User.findOne({ where: { Email: Email } })
    .then((data) => {
      if (!data) {
        res.status(200).send({ exists: false });
      } else {
        res.status(200).send({ exists: true });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error checking Email" });
    });
};

import db from "../database.js";

const Class = db.classes;

// Create and Save a new Class. columns are ClassID, ClassName, UserID, TotalClassesAttended, TotalClassesTaken, StartDate
export const createClass = async (req, res) => {
  // Validate request
  if (!req.body.ClassName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Class
  const Class = {
    ClassName: req.body.ClassName,
    UserID: req.body.UserID,
    TotalClassesAttended: req.body.TotalClassesAttended,
    TotalClassesTaken: req.body.TotalClassesTaken,
    StartDate: req.body.StartDate,
  };

  // Save Class in the database
  await Class.create(Class)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error" + err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Class.",
      });
    });
};

// retrieve all ClassName from the database based on UserID
export const getClass = async (req, res) => {
  const UserID = req.params.UserID;

  await Class.findAll({ where: { UserID: UserID }, attributes: {} })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found Class with UserID " + UserID });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Class with UserID=" + UserID });
    });
};

// delete a class based on ClassName
export const deleteClass = async (req, res) => {
  const ClassID = req.params.ClassID;

  await Class.destroy({ where: { ClassID: ClassID } })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found Class with ClassID " + ClassID });
      } else {
        res.status(200).send({ message: "Class deleted successfully!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Class with ClassID=" + ClassID,
      });
    });
};

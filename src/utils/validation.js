const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(emailId.trim())) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not valid");
  }
};

const validateUserProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "about",
    "skills",
    "age",
    "photoURL",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    allowedEditFields.includes(field);
  });

  return isEditAllowed;
};

module.exports = {
  validateSignUp,
  validateUserProfileData,
};

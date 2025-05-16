const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  console.log("req.body", req.body);

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
    "gender",
    "skills",
    "age",
    "photoURL",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });

  if (!isEditAllowed) {
    throw new Error("Invalid fields in the request body");
  }
  return isEditAllowed;
};

module.exports = {
  validateSignUp,
  validateUserProfileData,
};

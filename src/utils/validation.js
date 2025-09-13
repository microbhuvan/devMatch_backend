const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  console.log("req.body", req.body);

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(emailId.trim())) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain at least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 special character."
    );
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

  //Object.keys gives all the keys as an elements of array [key1,key2]
  //every means all the elements in the array must pass the condition [value1,value2]
  //object.values for values and object.entries for key value [[key,value],[key,value]]
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

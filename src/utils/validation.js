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

module.exports = {
  validateSignUp,
};

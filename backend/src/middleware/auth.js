const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("token is not valid");
    }

    const userId = await jwt.verify(token, "PENGUIN@2024");
    const { id } = userId;
    //because userId returns iat and exp value

    const user = await User.findById(id);
    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
};

module.exports = {
  userAuth,
};

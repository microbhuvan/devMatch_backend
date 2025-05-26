const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("please login"); //401 means unauthorized
    }

    const userId = await jwt.verify(token, process.env.JWT_SECRET);
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

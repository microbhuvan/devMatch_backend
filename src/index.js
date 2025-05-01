const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
//
const connectDB = require("./config/database.js");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation.js");
const { userAuth } = require("./middleware/auth.js");
const app = express();

app.use(express.json());
app.use(cookieParser());

//to add new user
app.post("/signup", async (req, res) => {
  try {
    //validating signup
    validateSignUp(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //returns whole user
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log(isPasswordValid);

    if (isPasswordValid) {
      //creating a jwt token
      const token = await user.getJWT();
      console.log(token);

      res.cookie("token", token);
      res.send("user logged in successfully");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.post("/sendConReq", userAuth, (req, res) => {
  const user = req.user;
  res.send("request sent by: " + user.firstName);
});

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(3000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });

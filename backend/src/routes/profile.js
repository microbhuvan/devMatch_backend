const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { validateUserProfileData } = require("../utils/validation.js");

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUserProfileData(req);
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    console.log(loggedInUser);
    await loggedInUser.save();

    res.send(`${loggedInUser.firstName}, your profile was updated successful`);
  } catch (err) {
    res.send(400).send("something went wrong: " + err.message);
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    res.send("testing");
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

module.exports = profileRouter;

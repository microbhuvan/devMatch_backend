const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { validateUserProfileData } = require("../utils/validation.js");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const upload = require("../utils/multer.js");
const { cloudinary } = require("../utils/cloudinary.js");

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    console.log("Route hit");

    try {
      console.log("req.body", req.body);
      console.log("req.file", req.file);

      validateUserProfileData(req);
      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => {
        if (key === "skills" && req.body.skills) {
          loggedInUser.skills = req.body.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);
        } else {
          loggedInUser[key] = req.body[key];
        }
      });

      if (req.file && req.file.path) {
        console.log("New photo uploaded, updating...");
        if (loggedInUser.photoPublicId) {
          console.log(
            "Deleting old Cloudinary photo:",
            loggedInUser.photoPublicId
          );
          try {
            await cloudinary.uploader.destroy(loggedInUser.photoPublicId);
            console.log("Old photo deleted successfully.");
          } catch (err) {
            throw new Error("Error deleting old photo:", err.message);
          }
        }

        loggedInUser.photoURL = req.file.path;
        loggedInUser.photoPublicId = req.file.filename;
      }

      console.log("Before save:", loggedInUser);
      await loggedInUser.save();
      console.log("After save");

      res.json({ message: "Profile updated successfully", data: loggedInUser });
      console.log("Response sent to client");
    } catch (err) {
      console.error("Error in /profile/edit:", err);
      res.status(400).send("something went wrong: " + err.message);
    }
  }
);

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).send("something went wrong: " + err.message);
  }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  try {
    const { emailId } = req.user;
    const { newPassword, newPassword2 } = req.body;

    if (!newPassword || !newPassword2) {
      return res.status(400).send("password fields cant be empty");
    }

    if (newPassword !== newPassword2) {
      return res.status(400).send("password does not match");
    }

    const user = await User.findOne({ emailId: emailId });

    if (user) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;
      await user.save();
      console.log(user);
      return res.status(200).send("password updated successfully");
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    return res.status(500).send("something  went wrong: " + err.message);
  }
});

module.exports = profileRouter;

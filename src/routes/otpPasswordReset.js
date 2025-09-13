require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
const User = require("../models/user");
const OTP = require("../models/otpModel");

const otpRouter = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

otpRouter.post("/request-reset-otp", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.json({ message: "user not found" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; //10 mins from now
    await OTP.create({ emailId, otp, expiresAt, isUsed: false });

    await resend.emails.send({
      from: "DevMatch <noreply@devmatch.co.in>",
      to: emailId,
      subject: "Your devMatch password reset OTP",
      text: `Your OTP for resetting your devMatch password is ${otp} . It is valid for 10 minutes only`,
    });

    return res.json({ message: "otp sent to your email" });
  } catch (err) {
    return res.status(400).send("something went wrong: " + err.message);
  }
});

otpRouter.post("/verify-reset-otp", async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    const otpRecord = await OTP.findOne({ emailId, otp, isUsed: false });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    return res.status(400).send("error occured " + err.message);
  }
});

otpRouter.post("/reset-password", async (req, res) => {
  const { emailId, newPassword } = req.body;
  const user = await User.findOne({ emailId });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const verifiedOTP = await OTP.findOne({ emailId, isUsed: true }).sort({
    updatedAt: -1,
  });
  if (!verifiedOTP) {
    return res.status(400).json({ message: "otp is not verified" });
  }

  const maxVerificationAge = 15 * 60 * 1000;
  if (Date.now() - verifiedOTP.updatedAt > maxVerificationAge) {
    return res
      .status(400)
      .json({ message: "OTP verification expired, request a new one." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return res.json({ message: "password changed successfully" });
});

module.exports = otpRouter;

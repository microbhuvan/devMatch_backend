const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { connection } = require("mongoose");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user.js");
const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //console.log(req);
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `invalid status type: ${status}` });
      }

      //checking for existing connection
      const existingConnectionReq = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      //console.log(existingConnectionReq);
      if (existingConnectionReq) {
        return res.status(400).json({ message: "connection already exists" });
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(400).json({ message: "user does not exist" });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // Send email notification to the recipient
      try {
        const emailRes = await sendEmail.run(
          "A new friend request from " + req.user.firstName,
          req.user.firstName + " is " + status + " in " + toUser.firstName,
          toUser.emailId // recipient's email
        );
        console.log("Email sent successfully:", emailRes);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails, just log the error
      }

      res.json({
        message: `${req.user.firstName} is intersted in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("something went wrong: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    /*
    so this is checking if the loggedin user has a connection req from other people 
    if it is from other people it will give the loggedinuser id in touser place
    */
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      //validating status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "invalid status" });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      // Send email notification to the requester about the response
      try {
        const fromUser = await User.findOne({
          _id: connectionRequest.fromUserId,
        });
        if (fromUser) {
          const emailRes = await sendEmail.run(
            `Your friend request has been ${status}`,
            `Your friend request to ${loggedInUser.firstName} has been ${status}.`,
            fromUser.emailId
          );
          console.log("Response email sent successfully:", emailRes);
        }
      } catch (emailError) {
        console.error("Failed to send response email:", emailError);
        // Don't fail the request if email fails, just log the error
      }

      res.json({ message: `connection request ${status}`, data });
    } catch (err) {
      res.status(400).send("something went wrong: " + err.message);
    }
  }
);

module.exports = requestRouter;

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

      console.log(existingConnectionReq);
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

      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // ); //email sending
      // console.log(emailRes);

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

      res.json({ message: `connection request ${status}`, data });
    } catch (err) {
      res.status(400).send("something went wrong: " + err.message);
    }
  }
);

module.exports = requestRouter;

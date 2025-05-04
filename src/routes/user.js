const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA =
  "firstName lastName emailId photoURL age gender about skills";

//getting all the leftover request of the logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUser.id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequest) {
      throw new Error("data not found");
    }

    console.log(connectionRequest);
    res.json({
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const connectionRequest = await connectionRequestModel
    .find({
      $or: [
        { toUserId: loggedInUser.id, status: "accepted" },
        { fromUserId: loggedInUser.id, status: "accepted" },
      ],
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = connectionRequest.map((row) => {
    if (row.fromUserId.id.toString() === loggedInUser.id.toString()) {
      return row.toUserId;
    }
  });

  res.json(connectionRequest);
});

module.exports = userRouter;

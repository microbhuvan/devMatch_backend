const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  //should not see
  //own profile, already connected, ignored people, already sent connection request,
  //rejected and acccepted people also will not be allowed
  try {
    const loggedInUser = req.user;

    console.log("req.params=", req.params.page);
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    //check sent and received requests
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser.id }, { toUserId: loggedInUser.id }],
      })
      .select("fromUserId toUserId");

    console.log(connectionRequest);

    const connectionSet = new Set(); //hiding the users
    connectionRequest.map((row) => {
      console.log(row);
      connectionSet.add(row.fromUserId.toString()); //converts object ids to string
      connectionSet.add(row.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        //exclude users who are already connected
        { _id: { $nin: Array.from(connectionSet) } },
        //exclude the logged-in user's own profile
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//pagination
// /feed?page=1&limit=10 => 1-10
// /feed?page=2&limit=10 => 11-20 skip(10) limit(10)
// /feed?page=3&limit=10 => 21-30

// skip = (page-1)*limit => eg page=3 then 2*10 => 20

module.exports = userRouter;

const express = require("express");
const { Chat } = require("../models/chat");
const chatRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.params;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});

module.exports = chatRouter;

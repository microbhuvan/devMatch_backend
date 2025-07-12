const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };

/*
{
  _id: ObjectId("..."),
  participants: [ObjectId("user1"), ObjectId("user2")],
  messages: [
    {
      senderId: ObjectId("user1"),
      text: "Hey!",
      createdAt: ..., // automatically added by timestamps
      updatedAt: ...
    },
    {
      senderId: ObjectId("user2"),
      text: "Hello!",
      createdAt: ...,
      updatedAt: ...
    }
  ]
}

*/

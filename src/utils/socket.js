const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const mongoose = require("mongoose");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joined room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + " " + text);

        try {
          const userObjId = mongoose.Types.ObjectId(userId);
          const targetUserObjId = mongoose.Types.ObjectId(targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userObjId, targetUserObjId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });

          await chat.save();
        } catch (err) {
          console.log(err);
        }

        io.to(roomId).emit("messageReceived", { firstName, text });
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

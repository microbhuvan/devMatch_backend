const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const mongoose = require("mongoose");

const getSecretRoomId = (userId, targetUserId) => {
  return (
    crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("_"))
      //sort makes sure the smaller oreder comes first
      //so that the order is maintained always
      .digest("hex")
  );
};

//server here is existing http server
const initializeSocket = (server) => {
  //attaching socket.io to server
  const io = socket(server, {
    //io here is socket.io server instance
    cors: {
      origin: "http://localhost:5173", //only if request is from this origin will socket.io handle
    },
  });

  //runs everytime a new client connects to the server
  //socket here is socket.io single client instance
  io.on("connection", (socket) => {
    //join chat event is triggered by client
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joined room : " + roomId);
      socket.join(roomId); //puts client sockets in the room
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          //const userObjId = mongoose.Types.ObjectId(userId);
          //const targetUserObjId = mongoose.Types.ObjectId(targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

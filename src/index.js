const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
//
const connectDB = require("./config/database.js");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
  //{ withCredentials: true } in frontend axios call
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");
const initializeSocket = require("./utils/socket.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("database connection established");
    server.listen(process.env.PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });

//test

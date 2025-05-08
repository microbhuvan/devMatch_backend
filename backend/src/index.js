const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
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

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(3000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });

//test

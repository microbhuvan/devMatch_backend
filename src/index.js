const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("hi from /test");
});

app.use((req, res) => {
  res.send("hi from server");
});

app.listen(3000, () => {
  console.log("server started");
});

const express = require("express");

const app = express();

app.post("/test/:id/:name", (req, res) => {
  console.log(req.params);
  res.send(`the params are ${JSON.stringify(req.params)}`);
});

app.post("/test", (req, res) => {
  console.log(req.query);
  res.send(`the query is ${JSON.stringify(req.query)}`);
});

app.use((req, res) => {
  res.send("hi from server");
});

app.listen(3000, () => {
  console.log("server started");
});

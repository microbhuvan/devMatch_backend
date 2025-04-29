//index.js
app.use("/admin", adminAuth);

app.post("/test/:id/:name", (req, res) => {
  console.log(req.params);
  res.send(`the params are ${JSON.stringify(req.params)}`);
});

app.post("/test", (req, res) => {
  console.log(req.query);
  res.send(`the query is ${JSON.stringify(req.query)}`);
});

app.use(
  "/user",
  userAuth,
  (req, res, next) => {
    console.log("running handler 1");
    next();
  },
  (req, res) => {
    console.log("handling handler 2");
    res.send("handler 2");
  },
  (req, res) => {
    console.log("handling handle 3");
    res.send("handler 3");
  }
);

app.use((req, res) => {
  res.send("hi from server");
});

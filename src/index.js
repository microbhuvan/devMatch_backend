const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user");
const app = express();

app.use(express.json());

//to add new user
app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

//get user through email
app.get("/user", async (req, res) => {
  //retreiving user data through emailId
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });

    if (user.length == 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

//get user through id
app.get("/userId", async (req, res) => {
  console.log("req body", req.body);
  const userId = req.body.id;

  try {
    const user = await User.findById({ _id: userId });
    console.log(user);
    if (user.length == 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

//get user feed (all the user data)
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("users not found or database empty");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

//delete a specific user
app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

//patch update user (only parts of it can be updated)
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  //
  try {
    //making sure important data is not changed like emailId
    const ALLOWED_UPDATES = ["age", "gender", "photoURL", "about", "skills"];
    const isAllowedUpdates = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });
    console.log(isAllowedUpdates);
    if (!isAllowedUpdates) {
      throw new Error("updates not allowed to specific fields");
    }
    //to restrict the skills to less than 10
    if (data?.skills.length > 10) {
      throw new Error("more than 10 skills not allowed");
    }
    //finding and updating user value using Id
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    console.log(user);
    if (user.length == 0) {
      res.status(404).send("user not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).send("error saving the data: " + err.message);
  }
});

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

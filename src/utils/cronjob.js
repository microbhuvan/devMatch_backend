require("dotenv").config();
const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequestModel = require("../models/connectionRequest");

cron.schedule("* * * * *", async () => {
  // every day at 8 am
  try {
    //first categorize the yesterday by setting starting time and ending time
    console.log("cron job");
    const yesterday = subDays(new Date(), 1);
    console.log(yesterday);

    const yesterdayStart = startOfDay(yesterday);
    console.log(yesterdayStart);
    const yesterdayEnd = endOfDay(yesterday);
    console.log(yesterdayEnd);

    //take list of all interested status that have been created in yesterday's timeframe
    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        // createdAt: {
        //   $gte: yesterdayStart, //greater than or equal
        //   $lt: yesterdayEnd, //less than
        // },
        createdAt: { $exists: true },
      })
      .populate("fromUserId toUserId"); //("fromUserId", "name email") optional

    //from each object extract only email and use set for unique data
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "Pending requests. Login to accept or reject them.",
          email // passing recipient explicitly
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

/*
{
  "_id": "abc123",
  "status": "interested",
  "createdAt": "2025-05-26T14:00:00.000Z",
  "fromUserId": {
    "_id": "user123",
    "name": "Alice",
    "email": "alice@example.com",
    ...
  },
  "toUserId": {
    "_id": "user456",
    "name": "Bob",
    "email": "bob@example.com",
    ...
  }
}

*/

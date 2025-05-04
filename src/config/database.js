const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.DATABASE_URL;
const connectDB = async () => {
  await mongoose.connect(dbUrl);
};

module.exports = connectDB;

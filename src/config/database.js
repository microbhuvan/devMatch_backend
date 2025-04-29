const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://microbhuvan:WDIvdfqztHfmoyvm@cluster0.tlsjkxm.mongodb.net/tinder_c"
  );
};

module.exports = connectDB;

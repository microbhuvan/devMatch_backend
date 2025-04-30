const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email id: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        /* 
        { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, 
         returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, 
         pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
        */
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "password must contain 8 characters, 1 lowercase, 1 uppercase, 1 symbol"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    photoURL: {
      type: String,
      default: "C:/Users/Mallikarjuna/Desktop/tinder_c/profileimg.png",
      validate(value) {
        if (!validator.isURL(value) && !value.startsWith("C:/")) {
          throw new Error("error in loading image");
        }
      },
    },
    about: {
      type: String,
      default: "this is default about user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("more than 10 skills not allowed");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

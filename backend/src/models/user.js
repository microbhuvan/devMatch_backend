const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      enum: ["male", "female", "other"], // Directly specify the allowed values
      validate: {
        validator: function (value) {
          return ["male", "female", "other"].includes(value);
        },
        message: (props) => `${props.value} is not a valid gender type`, // Dynamic error message
      },
    },
    photoURL: {
      type: String,
      default:
        "https://as2.ftcdn.net/jpg/02/22/39/63/1000_F_222396357_KlP0TQwV3X1U6rJWzlLcIpJ7ZLpxGcQR.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
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

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ id: user.id }, "PENGUIN@2024", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(inputPassword, user.password);

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

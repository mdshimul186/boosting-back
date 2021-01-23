const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      max: 20,
      default: ""
    },
    lastName: {
      type: String,
      trim: true,
      max: 20,
      default: ""
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    acountType: {
      type: String,
      enum: ["company", "personal"],
      default: "personal",
    },
    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },
    mobile: {
      type: String,
      trim: true,
      default: "",
    },
    bankDetails: {
      type: String,
      trim: true,
      default: "",
    },
    paymentNumber: {
      type: String,
      trim: true,
      default: "",
    },
    NID: {
      front: {
        type: String,
        default: ""
      },
      back: {
        type: String,
        default: "",
      }
    },
    businessLicense: {
      type: String,
      trim: true,
      default: "",
    },
    TIN_VAT: {
      type: String,
      trim: true,
      default: "",
    },
    chairman_CEO_NID: {
      type: String,
      trim: true,
      default: "",
    },
    companyProfile: {
      type: String,
      trim: true,
      default: "",
    },
    hash_password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPassToken: {
      type: String,
      default: "",
    },
    isSuspended: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);

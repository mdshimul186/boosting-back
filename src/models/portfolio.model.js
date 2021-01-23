const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["design","development","marketing"],
      required:"true"
    },
    shortDescription:{
      type: String,
      default: ""
    },
    longDescription: {
      type: String,
      default:""
    },
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    portfolioImages:[{
      type: String,
      default: "",
    }],
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Portfolio", portfolioSchema);

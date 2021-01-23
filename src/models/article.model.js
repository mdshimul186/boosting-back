const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description:{
      type: String,
      required: true,
    },
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    tags: [],
    thumbnail:{
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Article", articleSchema);

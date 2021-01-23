const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ""
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    SKU:{
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shortDescription:{
      type: String,
      default: ""
    },
    description: {
      type: String,
      default:""
    },
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category"
    },
    reviews: [],
    productImages:[{
      type: String,
      default: "",
    }],
    isAvailable: {
      type: Boolean,
      default: true
    },
    VAT:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);

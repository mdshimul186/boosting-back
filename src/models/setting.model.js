const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
   serviceOptions:[{
       category:{type:mongoose.Schema.Types.ObjectId,ref:'Categpry'},
       position:{type:Number},
       product:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]
   }]
  },
  { timestamps: true }
);


module.exports = mongoose.model("Setting", settingSchema);

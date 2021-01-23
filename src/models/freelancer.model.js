const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    gender: {
      type: String,
      enum: ["male","female"],
      required: true
    },
    location:{
        type:String,
        default:""
    },
    profile:{
        type: String,
        default: '',
      },
    skills: {
      type: String,
      trim: true,
      default:''
    },
    title: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default:""
    },
    industry:{
      type: String,
      default: '',
    },
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    contacts: {
        phone:{type:String,default:""},
        facebook:{type:String,default:""},
        skype:{type:String,default:""},
        linkedin:{type:String,default:""},
        whatsapp:{type:String,default:""},
        email:{type:String,default:""},
    },
    portfolios:[{
        siteName:{type:String},
        siteType:{type:String},
        siteLink:{type:String}
    }],
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Freelancer", freelancerSchema);

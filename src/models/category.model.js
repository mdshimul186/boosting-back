const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    isApproved: {
        type: Boolean,
        default: true
    },
    parentId:{
        type:String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Category", categorySchema);
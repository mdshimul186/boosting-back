const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ["processing", "completed","cancelled"],
        default:"processing"
    },
    total:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentDetails:{
        type:String,
        required:true
    },
    orderId:{
        type:Number
    }
}, {
    timestamps: true
});

orderSchema.plugin(AutoIncrement,{inc_field:'orderId',start_seq:1000})

module.exports = mongoose.model("Order", orderSchema);
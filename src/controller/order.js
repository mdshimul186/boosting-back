const Product = require("../models/product.model");
const Order = require("../models/order.model");

//----------------------------------------------------------------------------------------------------------------
exports.createOrder = (req, res) => {
    const { product, total, paymentMethod, paymentDetails,name,mobile } = req.body
    if (!product) {
        return res.status(400).json({ error: "Product id is required" })
    }
    if (!total) {
        return res.status(400).json({ error: "Total amount is required" })
    }
    if (!paymentMethod) {
        return res.status(400).json({ error: "Payment method is required" })
    }
    if (!name) {
        return res.status(400).json({ error: "Name is required" })
    }
    if (!mobile) {
        return res.status(400).json({ error: "Mobile number is required" })
    }
    if (!paymentDetails) {
        return res.status(400).json({ error: "Trx is required" })
    }

    let _order = new Order({
        product,
        total,
        creator:req.user._id,
        paymentMethod,
        paymentDetails,
        name,
        mobile
    })

    _order.save()
    .then(order=>{
        
        res.status(201).json({success:true,order})
    })
    .catch(err=>{
        return res.status(400).json({ error: "Something went wrong" })
    })

}
//-------------------------------------------------------------------------------------------------------------

exports.myOrder=(req,res)=>{
    Order.find({creator:req.user._id})
    .sort("-createdAt")
    .then(order=>{
        res.status(201).json({success:true,order})
    })
    .catch(err=>{
        return res.status(400).json({ error: "Something went wrong" })
    })
}
//-------------------------------------------------------------------------------------------------------------

exports.allOrders=(req,res)=>{
    Order.find()
    .sort("-createdAt")
    .then(order=>{
        res.status(201).json({success:true,order})
    })
    .catch(err=>{
        return res.status(400).json({ error: "Something went wrong" })
    })
}
//-------------------------------------------------------------------------------------------------------------

exports.updateOrder=(req,res)=>{
    let orderId = req.params.orderid
    const {status} = req.body
    if(!status){
        return res.status(400).json({error:"Status is required"})
    }
    Order.findByIdAndUpdate(orderId,{$set:{status}},{new:true})
    .then(order=>{
        res.status(201).json({success:true,order})
    })
    .catch(err=>{
        return res.status(400).json({ error: "Something went wrong" })
    })
}
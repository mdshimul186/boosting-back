const Product = require("../models/product.model");
const Setting = require("../models/setting.model");
const mongoose = require('mongoose')
let ObjectId = mongoose.Types.ObjectId


//----------------------------------------------------------------------------------------------------------------

exports.createSetting=(req,res)=>{
    let _setting = new Setting({

    })

    _setting.save()
    .then(setting=>{
        res.json({setting})
    })
}

//-----------------------------------------------------------------------------------------------------------------
exports.addCategory=(req,res)=>{
    const {category,p1,p2,p3,p4,position}= req.body
    if(!category || !p1 || !p2 || !p3 || !p4 ||!position){
        return res.status(400).json({error:"All fields are required"})
    }

    const data = {
        serviceOptions:{
            category,
            position,
            product:[p1,p2,p3,p4]

        }
    }

    Setting.findByIdAndUpdate(process.env.SETTING,{$push:{serviceOptions:data.serviceOptions}},{new:true})
    .then(setting=>{
        res.status(200).json({setting,success:true})
    })
    .catch(err=>{
        res.status(400).json({error:"Something went wrong"})
    })
}

//-----------------------------------------------------------------------------------------------------------------
exports.getSetting=(req,res)=>{
    Setting.findById(process.env.SETTING)
    .populate({
        path:'serviceOptions',
        populate:{
            path:"category",
            model:"Category"
        }
    })
    .populate({
        path:'serviceOptions',
        populate:{
            path:"product",
            model:"Product"
        }
    })
    .then(setting=>{
        res.status(200).json({setting})
    })
    .catch(err=>{
        res.status(400).json({error:"Something went wrong"})
    })
}

//--------------------------------------------------------------------------------------------------------------

exports.removeCategory=(req,res)=>{
    
    let id = req.params.optionid
    console.log(id)
    Setting.findByIdAndUpdate(process.env.SETTING,{$pull:{serviceOptions:{_id:new ObjectId(id)}}},{new:true})
    .then(setting=>{
        res.status(200).json({setting,success:true})
    })
    .catch(err=>{
        console.log(err)
        res.status(400).json({error:"Something went wrong"})
    })
}

//-----------------------------------------------------------------------------------------------------------------

exports.updateCategory=(req,res)=>{
    let id = req.params.optionid
    const {category,p1,p2,p3,p4,position}= req.body
    if(!category || !p1 || !p2 || !p3 || !p4 ||!position || !id){
        return res.status(400).json({error:"All fields are required"})
    }

    const data = {
        serviceOptions:{
            category,
            position,
            product:[p1,p2,p3,p4]

        }
    }

    Setting.findOneAndUpdate({_id:process.env.SETTING,"serviceOptions._id":new ObjectId(id)},
    {$set:{"serviceOptions.$":data.serviceOptions}},{new:true}
    )
    .then(setting=>{
        res.status(200).json({setting,success:true})
    })
    .catch(err=>{
        console.log(err)
        res.status(400).json({error:"Something went wrong"})
    })
}
const Portfolio = require("../models/portfolio.model");




//------------------------------------------------------------------------------------------------------------------

exports.createPortfolio = (req, res) => {
    const {category, shortDescription, longDescription} = req.body
    
    if (!category) {
        return res.status(400).json({ error: "Category is required" })
    }

    let imagearray = []
    req.files.map(file => {
        imagearray.push(file.path)
    })

    if (imagearray.length === 0) {
        return res.status(400).json({ error: "Please select at least one images" })
    }

    let _portfolio = new Portfolio({
        category,
        shortDescription: shortDescription || "",
        longDescription: longDescription || "",
        creator: req.user._id,
        portfolioImages: imagearray

    })
    _portfolio.save()
        .then(portfolio => {
            res.status(201).json({
                success: true,
                portfolio
            })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}

//--------------------------------------------------------------------------------------------------------------
exports.getAll=(req,res)=>{
    let category = req.query.category
    let options = {}
    if(category){
        options.category = category
    }
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 20
    }

    Portfolio.find(options)
    .sort("-createdAt")
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(portfolio => {
        res.status(200).json({
            success: true,
            portfolio
        })
    })
    .catch(err => {
        res.status(400).json({ error: "Something went wrong" })
    })
}


//-----------------------------------------------------------------------------------------------------------------

exports.editPortfolio = (req, res) => {
    const {category, shortDescription, longDescription} = req.body

    let id = req.params.portfolioid
    
    if (!category) {
        return res.status(400).json({ error: "Category is required" })
    }

    let imagearray = []
    req.files.map(file => {
        imagearray.push(file.path)
    })
    // console.log(req.files)
    // if (req.files.length >0 && imagearray.length === 0) {
    //     return res.status(400).json({ error: "Please select at least one images" })
    // }

    

    let data = {
        category,
        shortDescription: shortDescription || "",
        longDescription: longDescription || "",

    }

    if(imagearray.length>0){
        data.portfolioImages = imagearray
    }
    Portfolio.findByIdAndUpdate(id,{$set:data},{new:true})
        .then(portfolio => {
            res.status(200).json({
                success: true,
                portfolio
            })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}


//----------------------------------------------------------------------------------------------------------------

exports.deletePortfolio=(req,res)=>{
    let id = req.params.portfolioid

    Portfolio.findByIdAndDelete(id)
    .then(deleted => {
        res.status(200).json({
            success: true
        })
    })
    .catch(err => {
        res.status(400).json({ error: "Something went wrong" })
    })
}



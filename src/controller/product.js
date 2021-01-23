const User = require("../models/user.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const slugify = require('slugify');
var csv = require('fast-csv');
const mongoose = require('mongoose')



const createCatList=(categories, parentId = null)=>{
    const categoryList = []
    let category
    if(parentId == null){
        category = categories.filter(cat=>cat.parentId == undefined)
    }else{
        category = categories.filter(cat=>cat.parentId == parentId)
    }
    for(let cate of category){
        categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            creator:cate.creator,
            isApproved:cate.isApproved,
            children:createCatList(categories,cate._id)
        })
    }
    return categoryList
}

//------------------------------------------------------------------------------------------------------------------

exports.addCategory = (req, res) => {
    const { name,parentId } = req.body
    if (!name) {
        return res.status(400).json({ error: "Category name is required" })
    }

    let obj = {
        name,
        slug: slugify(name),
        creator: req.user._id
    }
    if(parentId){
        obj.parentId = parentId
    }

    let _category = new Category(obj)

    _category.save()
        .then(category => {
            res.status(201).json({ success: true, category })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}
//------------------------------------------------------------------------------------------------------------------

exports.editCategory = (req, res) => {
    let categoryId = req.params.categoryid
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ error: "Category name is required" })
    }

    Category.findByIdAndUpdate(categoryId,{$set:{name}},{new:true})
        .then(category => {
            res.status(200).json({ success: true, category })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}
//------------------------------------------------------------------------------------------------------------------

exports.deleteCategory = (req, res) => {
    let categoryId = req.params.categoryid
    
    Category.findByIdAndDelete(categoryId)
        .then(category => {
            res.status(200).json({ success: true})
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}
//------------------------------------------------------------------------------------------------------------------

exports.getCategory = (req, res) => {
    Category.find()
        .then(category => {
            if(category){
                const categoryList = createCatList(category)
                res.status(200).json({ success: true, category:categoryList })
            }else{
                res.status(200).json({ success: true, category:[] })
            }
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}

//------------------------------------------------------------------------------------------------------------------

exports.createProduct = (req, res) => {
    const { title, SKU, price, shortDescription, description, category, VAT } = req.body
    console.log(title)
    if (!title) {
        return res.status(400).json({ error: "Title is required" })
    }
    if (!SKU) {
        return res.status(400).json({ error: "SKU is required" })
    }
    if (!price) {
        return res.status(400).json({ error: "Price is required" })
    }
    if (!category) {
        return res.status(400).json({ error: "Category is required" })
    }

    let imagearray = []
    req.files.map(file => {
        imagearray.push(file.path)
    })

    let _product = new Product({
        title,
        slug: slugify(title),
        price,
        shortDescription: shortDescription || "",
        description: description || "",
        category,
        VAT: VAT || 0,
        SKU,
        creator: req.user._id,
        productImages: imagearray

    })
    _product.save()
    Product.populate(_product, {
        path: "category",
    })
        .then(product => {
            res.status(201).json({
                success: true,
                product
            })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}

//------------------------------------------------------------------------------------------------------------------
exports.getProductsByCategory = (req, res) => {
    let categorySlug = req.params.categoryslug
    let limit = parseInt(req.query.limit) || 0
    console.log(limit)
    Category.findOne({ slug: categorySlug })
        .then(category => {
            Product.find({ category: category._id })
                .limit(limit)
                .sort("-createdAt")
                .populate("category")
                .then(product => {
                    res.status(200).json({
                        success: true,
                        product
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({ error: "Something went wrong" })
                })
        })
        .catch(err => {
            res.status(400).json({ error: "Something went wrong" })
        })
}

//------------------------------------------------------------------------------------------------------------------

exports.getProductBySlug = (req, res) => {
    const productSlug = req.params.productslug
    Product.findOne({ slug: productSlug })
        .populate("category")
        .then(product => {
            res.status(200).json({
                success: true,
                product
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({ error: "Something went wrong" })
        })

}

//----------------------------------------------------------------------------------------------------------------
exports.allProducts=(req,res)=>{
    Product.find()
    .populate("category")
    .sort("-createdAt")
    .then(product => {
        res.status(200).json({
            success: true,
            product
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({ error: "Something went wrong" })
    })
}

//----------------------------------------------------------------------------------------------------------------
exports.deleteProduct=(req,res)=>{
    let id = req.params.productid
    Product.findByIdAndDelete(id)
    .then(deleted=>{
        res.status(200).json({
            success: true,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({ error: "Something went wrong" })
    })
}
//----------------------------------------------------------------------------------------------------------------
exports.editProduct=(req,res)=>{
    let id = req.params.productid
    const { title, SKU, price, shortDescription, description, category, VAT } = req.body
    if (!title) {
        return res.status(400).json({ error: "Title is required" })
    }
    if (!SKU) {
        return res.status(400).json({ error: "SKU is required" })
    }
    if (!price) {
        return res.status(400).json({ error: "Price is required" })
    }
    if (!category) {
        return res.status(400).json({ error: "Category is required" })
    }
    let options = {
        title,
        SKU,
        price,
        shortDescription:shortDescription||'',
        description:description||'',
        category,
        VAT:VAT||0
    }
    Product.findByIdAndUpdate(id,{$set:options},{new:true})
    .populate("category")
    .then(product=>{
        res.status(200).json({
            success: true,
            product
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({ error: "Something went wrong" })
    })
}

//--------------------------------------------------------------------------------------------------------------

exports.bulkUpload=(req,res)=>{
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 console.log(req.files)
var authorFile = req.files.file;

let csvData = [];
     

csv.parseString(authorFile.data.toString())
    .on('error', error => console.error(error))
    .on('data', data => {
        csvData.push({
            _id:new mongoose.Types.ObjectId(),
            title: data[0],
            slug: slugify(data[0]),
            shortDescription: data[1],
            description: data[2],
            category: data[3],
            price: data[4],
            SKU: data[5],
            VAT: data[6],
            productImages:[data[7],data[8],data[9]],
            creator:req.user._id
          });
    })
    .on('end', rowCount => {
        csvData.shift();
      
         Product.create(csvData, function(err, documents) {
             if (err) return res.status(400).json({error:"invalid product code/name"});
             res.status(200).json({
                success: true,
                documents
            })
         });
       
    });

// csv
//  .parseFile(authorFile.data.toString(), {
//      headers: true,
//      ignoreEmpty: true
//  })
//  .on("data", function(data){
//     //  data['_id'] = new mongoose.Types.ObjectId();
//       console.log(data)
//     //  authors.push(data);
//  })
//  .on("end", function(){
//     //  Author.create(authors, function(err, documents) {
//     //     if (err) throw err;
//     //  });
//     //res.send(authors)
//      //res.send(authors.length + ' authors have been successfully uploaded.');
//  });

}
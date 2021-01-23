const User = require("../models/user.model");
const Article = require("../models/article.model");
const slugify = require('slugify');
const shortId = require('shortid')

//----------------------------------------------------------------------------------------------------------------
exports.createArticle = (req, res) => {
    const { title, description, tags } = req.body

    const file = req.file

    if (!file) {
        return res.status(400).json({ error: "Thumbnail is required " })
    }

    if (!title) {
        return res.status(400).json({ error: "Title should be more then 10 words " })
    }
    if (!description) {
        return res.status(400).json({ error: "Description should be more then 32 words " })
    }


    let _article = new Article({
        creator: req.user._id,
        title,
        description,
        slug: slugify(title + "-" + shortId.generate()),
        thumbnail: file.path,
        tags: tags ? tags.split(',') : []

    })

    _article.save()
    Article.populate(_article, { path: "creator" })
        .then(article => {
            res.status(201).json({ success: true, article })
        })
        .catch(err => {
            res.status(400).json({ error: "something went wrong" })
        })
}

//-------------------------------------------------------------------------------------------------------------
exports.articleImages = (req,res)=>{
    const file = req.file
    console.log(file)
    return res.status(200).json({ imgUrl: file ?file.path:null })
}
//-------------------------------------------------------------------------------------------------------------
exports.getArticle=(req,res)=>{
    Article.find()
    .sort("-createdAt")
    .populate('creator','userName')
    .then(articles => {
        res.status(200).json({ success: true, articles })
    })
    .catch(err => {
        res.status(400).json({ error: "something went wrong" })
    })
}
//--------------------------------------------------------------------------------------------------------------
exports.deleteArticle=(req,res)=>{
    let articleId = req.params.articleid
    if(!articleId){
        return res.status(400).json({error:"Article id is required"})
    }

    Article.findByIdAndDelete(articleId)
    .then(deleted=>{
        res.status(200).json({ success: true})
    })
    .catch(err => {
        res.status(400).json({ error: "something went wrong" })
    })
}

//----------------------------------------------------------------------------------------------------------------
exports.editArticle = (req, res) => {
    const { title, description, tags } = req.body
    let articleId = req.params.articleid

    const file = req.file

    let options = {}

    if (file) {
        options.thumbnail=file.path
    }

    if (title) {
        options.title = title
        options.slug = slugify(title + "-" + shortId.generate())
    }
    if (description) {
        options.description = description
    }
    if (tags) {
        options.tags = tags ? tags.split(',') : []
    }
    if(!articleId){
        return res.status(400).json({error:"Article id is required"})
    }

  

   
    Article.findByIdAndUpdate(articleId, {$set:options},{new:true})
        .populate('creator','userName')
        .then(article => {
            res.status(201).json({ success: true, article })
        })
        .catch(err => {
            res.status(400).json({ error: "something went wrong" })
        })
}

//-------------------------------------------------------------------------------------------------------------

exports.getArticleBySlug=(req,res)=>{
    let slug = req.params.slug
    Article.findOne({slug})
    .populate('creator','userName')
    .then(article => {
        res.status(201).json({ success: true, article })
    })
    .catch(err => {
        res.status(400).json({ error: "something went wrong" })
    })
}

const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {createArticle,articleImages,getArticle,getArticleBySlug,deleteArticle,editArticle} = require("../controller/article");
const upload = require("../common-middleware/imageUpload");


router.post('/create',requireSignin,upload.single("thumbnail"),createArticle)
router.patch('/edit/:articleid',requireSignin,upload.single("thumbnailedit"),editArticle)
router.get('/getall',getArticle)
router.get('/single/:slug',getArticleBySlug)
router.delete('/delete/:articleid',requireSignin,adminMiddleware,deleteArticle)
router.post('/articleimages',requireSignin,upload.single("articleimages"),articleImages)

module.exports = router;
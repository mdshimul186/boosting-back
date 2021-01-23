const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {addCategory,editCategory,deleteCategory,getCategory,createProduct,getProductsByCategory,getProductBySlug,allProducts,deleteProduct,editProduct,bulkUpload} = require("../controller/product");
const upload = require("../common-middleware/imageUpload");
var fileUpload = require('express-fileupload');

router.post('/addcategory',requireSignin,adminMiddleware,addCategory)
router.post('/editcategory/:categoryid',requireSignin,adminMiddleware,editCategory)
router.delete('/deletecategory/:categoryid',requireSignin,adminMiddleware,deleteCategory)
router.get('/category',getCategory)


router.post('/create',requireSignin,adminMiddleware,upload.array('productImg'),createProduct)
router.get("/categoryproduct/:categoryslug",getProductsByCategory)
router.get('/getproduct/:productslug',getProductBySlug)
router.get("/allproducts",allProducts)

router.delete('/delete/:productid',requireSignin,adminMiddleware,deleteProduct)
router.patch('/edit/:productid',requireSignin,adminMiddleware,editProduct)

router.post('/bulk',requireSignin,adminMiddleware,fileUpload(),bulkUpload)

module.exports = router;
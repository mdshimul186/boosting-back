const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {createSetting,addCategory,getSetting,removeCategory,updateCategory} = require("../controller/setting");
const upload = require("../common-middleware/imageUpload");


router.post('/create',requireSignin,adminMiddleware,createSetting)
router.post('/addcategory',requireSignin,adminMiddleware,addCategory)
router.patch('/remove/:optionid',requireSignin,adminMiddleware,removeCategory)
router.patch('/update/:optionid',requireSignin,adminMiddleware,updateCategory)
router.get('/getsetting',getSetting)


module.exports = router;
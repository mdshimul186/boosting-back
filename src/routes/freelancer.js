const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {createFreelancer,getAll,deleteFreelancer,editFreelancer,bulkUpload} = require("../controller/freelancer");
const upload = require("../common-middleware/imageUpload");
var fileUpload = require('express-fileupload');

router.post('/create',requireSignin,adminMiddleware,upload.single('freelancerImg'),createFreelancer)
router.patch('/edit/:freelancerid',requireSignin,adminMiddleware,upload.single('freelancerImg'),editFreelancer)
router.delete('/delete/:freelancerid',requireSignin,adminMiddleware,deleteFreelancer)
router.get('/getall',getAll)
router.post('/bulk',requireSignin,adminMiddleware,fileUpload(),bulkUpload)



module.exports = router;
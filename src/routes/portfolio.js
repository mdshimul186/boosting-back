const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {createPortfolio,getAll,editPortfolio,deletePortfolio} = require("../controller/portfolio");
const upload = require("../common-middleware/imageUpload");

router.post('/create',requireSignin,adminMiddleware,upload.array('portfolioImg'),createPortfolio)
router.patch('/edit/:portfolioid',requireSignin,adminMiddleware,upload.array('portfolioImg'),editPortfolio)
router.delete('/delete/:portfolioid',requireSignin,adminMiddleware,deletePortfolio)
router.get('/getall',getAll)


module.exports = router;
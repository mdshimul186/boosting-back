const express = require("express");
const router = express.Router();
const { requireSignin,adminMiddleware } = require("../common-middleware");
const {createOrder,myOrder,allOrders,updateOrder} = require("../controller/order");

router.post('/create',requireSignin,createOrder)
router.get('/myorders',requireSignin,myOrder)
router.get('/allorders',requireSignin,adminMiddleware,allOrders)
router.patch('/update/:orderid',requireSignin,adminMiddleware,updateOrder)

module.exports = router;
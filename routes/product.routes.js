const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../models/product.model");

router.get("/product/list", (req,res)=>{
 Product.find()
 .then(allProducts=>{
     res.json(allProducts)
 })
 .catch((err)=>console.log(err))
})

router.post('/product/create',(req,res)=>{
    Product.create(req.body)
    .then(newProduct=>{
        res.json({newProduct})
    })
    .catch((err)=>console.log(err))
})

module.exports = router;
const router = require("express").Router();
const mongoose = require("mongoose");
const Badge = require("../models/Badge.model")
const User = require("../models/User.model");

router.get("/user/list", (req,res)=>{
 User.find()
 .then(allUsers=>{
     res.json(allUsers)
 })
 .catch((err)=>console.log(err))
})

router.post('/user/create',(req,res)=>{
    User.create(req.body)
    .then(newUser=>{
        res.json({newUser})
    })
    .catch((err)=>console.log(err))
})


module.exports = router;
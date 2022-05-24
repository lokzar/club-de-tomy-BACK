const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")

const Badge = require("../models/Badge.model");

router.get("/badge/list", (req,res)=>{
 Badge.find()
 .then(allBadges=>{
     res.json(allBadges)
 })
 .catch((err)=>console.log(err))
})

router.post('/badge/create',(req,res)=>{
    Badge.create(req.body)
    .then(newBadge=>{
        res.json({newBadge})
    })
    .catch((err)=>console.log(err))
})

//encontrar insignia por ID
router.get("/badge/findById", (req,res)=>{
    Badge.findById(req.body)
    .then(idBadge=>{
        res.json(idBadge)
    })
    .catch((err)=>console.log(err))
   })


//asignar insignias
router.put('/badge/:userId', (req,res)=>{  
    Badge.findById(req.body)
    .then(findedBadge=>{
        const {userId}= req.params
        return User.findByIdAndUpdate(userId, {$push:{badge:findedBadge._id}},{new:true})
    })
    .then((updatedUser)=>{
        res.json(updatedUser)})
    .catch(err=>res.json(err))
})

//asignar valor de insignia a saldo
router.put('/badge/value/:userId', (req,res)=>{ 
Badge.findById(req.body._id)
.then(findedBadge=>{
    const {userId}= req.params
    const {balance}=req.body
    return User.findByIdAndUpdate(userId, {balance: balance + findedBadge.value},{new:true})
})
.then((updatedUser)=>{
    res.json(updatedUser)})
.catch(err=>res.json(err))
})

//eliminar insignias
router.put('/badge/delete/:userId', (req,res)=>{  
    Badge.findById(req.body._id)
    .then(findedBadge=>{
        const {userId}= req.params
        return User.findByIdAndUpdate(userId, {$pull:{badge:{$in: findedBadge._id}}},{new:true})
    })
    .then((updatedUser)=>{
        res.json(updatedUser)})
    .catch(err=>res.json(err))
})


module.exports = router;
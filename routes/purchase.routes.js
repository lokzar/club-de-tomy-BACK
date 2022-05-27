const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")
const Purchase = require("../models/Purchase.model")
const Product = require("../models/Product.model");

//buscar productos
router.get("/product/list", (req, res) => {
    Product
        .find()
        .then(allProducts => {
            res.json(allProducts)
        })
        .catch((err) => console.log(err))
})

//crear productos
router.post('/product/create', (req, res) => {
    Product
        .create(req.body)
        .then(newProduct => {
            res.json({newProduct})
        })
        .catch((err) => console.log(err))
})

//crear compra y asignarse al usuario
router.post('/purchase/create', (req, res) => {
    const {userId} = req.body
    Purchase
        .create({user: userId})
        .then(createdPurchase => {
            res.json(createdPurchase)
            const {userId} = req.body
            return User.findByIdAndUpdate(userId, {
                $push: {
                    purchase: createdPurchase._id
                }
            }, {new: true})
        })
        .then((updatedUser) => {
            console.log("")
        })
        .catch(err => res.json(err))
})

//buscar todas las compras
router.get("/purchase/all", (req, res) => {
    Purchase
        .find()
        .populate("product")
        .then(openPurchase => {
            res.json(openPurchase)
        })
        .catch((err) => console.log(err))
})

//buscar compras abiertas
router.get("/purchase/list", (req, res) => {
    Purchase
        .find({isOpen:true})
        .populate("product")
        .then(openPurchase => {
            res.json(openPurchase)
        })
        .catch((err) => console.log(err))
})

//buscar compras cerradas
router.get("/purchase/listClose", (req, res) => {
    Purchase
        .find({isOpen:false})
        .populate("product")
        .then(openPurchase => {
            res.json(openPurchase)
        })
        .catch((err) => console.log(err))
})



//asignar productos a compra
router.put('/purchase/asignProducts', (req, res) => {
    Product
        .findById(req.body._id)
        .then(findedProduct => {
            const {purchaseId} = req.body
            return Purchase.findByIdAndUpdate(purchaseId, {
                $push: {
                    product: findedProduct._id
                }
            }, {new: true})
        })
        .then((updatedPurchase) => {
            res.json(updatedPurchase)
        })
        .catch(err => res.json(err))
})

//asignar valor de producto a total
router.put('/purchase/total', (req, res) => {
    Product
        .findById(req.body._id)
        .then(findedProduct => {
            const {purchaseId} = req.body
            const {total} = req.body
            return Purchase.findByIdAndUpdate(purchaseId, {
                total: total + findedProduct.price
            }, {new: true})
        })
        .then((updatedPurchase) => {
            res.json(updatedPurchase)
        })
        .catch(err => res.json(err))
})

//desasignar productos a compra
router.put('/purchase/unasignProducts', (req, res) => {
    Product
        .findById(req.body._id)
        .then(findedProduct => {
            const {purchaseId} = req.body
            return Purchase.findByIdAndUpdate(purchaseId, {
                $pull: {
                    product: {
                        $in: findedProduct._id
                    }
                }
            }, {new: true})
        })
        .then((updatedPurchase) => {
            res.json(updatedPurchase)
        })
        .catch(err => res.json(err))
})

//desasgnar valor del producto a total
router.put('/purchase/totalDiscount', (req, res) => {
    Product
        .findById(req.body._id)
        .then(findedProduct => {
            const {purchaseId} = req.body
            const {total} = req.body
            return Purchase.findByIdAndUpdate(purchaseId, {
                total: total - findedProduct.price
            }, {new: true})
        })
        .then((updatedPurchase) => {
            res.json(updatedPurchase)
        })
        .catch(err => res.json(err))
})

//cambiar estatus de compra a cerrada
router.put('/purchase/closed', (req,res) => {
    Purchase
    .findByIdAndUpdate(req.body._id,{isOpen:false},{new:true})
    .then(closedPurchase=>{
        res.json(closedPurchase)
        const{balance}=req.body
        return User.findByIdAndUpdate(closedPurchase.user._id,{
                    balance: balance - closedPurchase.total
                },{new:true})
    })
    .then((newUserBalance)=>{
        console.log("")
    })
    .catch(err=>res.json(err))
})






//desasignar compra de usuario
router.put('/purchase/unasignPurchase', (req, res) => {
    Purchase
        .findById(req.body._id)
        .then(findedPurchase => {
            const {userId} = req.body
            return User.findByIdAndUpdate(userId, {
                $pull: {
                    purchase: {
                        $in: findedPurchase._id
                    }
                }
            }, {new: true})
        })
        .then((updatedUser) => {
            res.json(updatedUser)
        })
        .catch(err => res.json(err))
})

//eliminar compra
router.delete('/purchase/delete', (req, res) => {
    const {purchaseId} = req.body
    Purchase
        .findByIdAndRemove(purchaseId)
        .then(() => {
            res.json({message: "Se ha eliminado la compra"})
        })
        .catch(err => res.json(err))
})

module.exports = router;
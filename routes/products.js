const express = require('express');
const Validator = require('fastest-validator');
const { Product } = require('../models')

const router = express.Router();
const v = new Validator

/* GET users listing. */
router.get('/', async(req, res, next) => {
  const products = await Product.findAll({ limit: 10 })
  return res.status(200).json(products)
});

router.get('/:productId', async(req, res, next) => {
    const productId = req.params.productId
    const product = await Product.findByPk(productId)
    return res.status(200).json(product)
})

router.post('/', async(req, res, next) => {
    // res.send('ini adalah post product')
    console.log(req.body)
    
    // schema validation
    const schema = {
        name: {type: "string"},
        brand: {type: "string"},
        description: {type: "string", optional: true},
    }

    // validasi
    const validate = v.validate(req.body, schema)

    // cek error
    if(validate.length){
        return res.status(400).json(validate)
    }

    const product = await Product.create(req.body)

    // res.status(201).send('ok')
    // return product
    return res.status(201).json(product)
})

router.put('/:productId', async(req, res, next) => {
    const productId = req.params.productId

    const product = await Product.findByPk(productId)

    if(!product){
        return res.status(400).json({
            message: 'Product not found'
        })
    }
    
     // schema validation
     const schema = {
        name: {type: "string"},
        brand: {type: "string"},
        description: {type: "string", optional: true},
    }

    // validasi
    const validate = v.validate(req.body, schema)

    // cek error
    if(validate.length){
        return res.status(400).json(validate)
    }

    // product.set({
    //     name: req.body.name,
    //     brand: req.body.brand,
    //     description: req.body.description
    // })

    await product.update({
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description
    })


    res.status(200).json(product)
})

router.delete('/:productId', async(req, res, next) => {
    const productId = req.params.productId

    const product = await Product.findByPk(productId)
    if(!product){
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    await product.destroy()

    return res.status(200).json({
        message: 'Product has been successfully deleted'
    })
})

module.exports = router;

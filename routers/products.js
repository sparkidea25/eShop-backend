const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    let filter = {}
    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        res.status(500).json({ success: false });
    } 
    res.send(productList);
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
})

router.put('/:id', async (req, res) => {
    // validating ID
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

     product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescrption: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        }, {
            new: true
        }
    )
    if (!product)
        return res.status(500).send('the product cannot be updated');
    res.send(product);
})

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category')
    }
    let product = Product({
        name: req.body.name,
        description: req.body.description,
        richDescrption: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });
    product = await product.save();
    if (!product)
        return res.status(500).send('the product cannot be created');
    res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({ success: true, message: 'the product is deleted' });
            } else {
                return res.status(404).json({success: false, message: 'product not found'})
            }
        }).catch(err => {
            return res.status(400).json({success: false, error: err})
        })
})

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        return res.status(500).json({success: false})
    }
    res.send({
        productCount: productCount
    });
})

router.get('/get/featured', async (req, res) => {
    const products = await Product.find({isFeatured: true})

    if (!products) {
        return res.status(500).json({success: false})
    }
    res.send(products);
})

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) { 
        return res.status(500).json({success: false})
    }
    res.send(products);
})



module.exports = router;
const router = require('express').Router();

const Book = require('../models/Book.js');
const bookServices = require('../services/bookServices.js');

const bookUtils = require('../utils/bookUtils.js');


router.get('/', (req, res) => {
    // console.log(req.user)
    res.render('home/index')
});


router.get('/catalog', async (req, res) => {//

    let books = await Book.find().lean();
    // console.log(cryptos)
    // res.render('index', { cubes, search, difficultyFrom, diffficultyTo });
    res.render('book/catalog', { books });

});
router.get('/search', async (req, res) => {

    const { name, paymentMethod } = req.query;
    const book = await bookServices.search(name, paymentMethod);
    const paymentMethods = bookUtils.generatePaymentMethod(paymentMethod);



    res.render('home/search', { book, paymentMethods, name });

});

module.exports = router;
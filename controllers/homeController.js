const router = require('express').Router();

const Crypto = require('../models/Crypto.js');
const cryptoServices = require('../services/cryptoServices.js');

const cryptoUtils = require('../utils/cryptoUtils.js');


router.get('/', (req, res) => {
    // console.log(req.user)
    res.render('home/index')
});


router.get('/catalog', async (req, res) => {//

    let cryptos = await Crypto.find().lean();
    // console.log(cryptos)
    // res.render('index', { cubes, search, difficultyFrom, diffficultyTo });
    res.render('crypto/catalog', { cryptos });

});
router.get('/search', async (req, res) => {

    const { name, paymentMethod } = req.query;
    const crypto = await cryptoServices.search(name, paymentMethod);
    const paymentMethods = cryptoUtils.generatePaymentMethod(paymentMethod);



    res.render('home/search', { crypto, paymentMethods, name });

});

module.exports = router;

const router = require('express').Router();

const Crypto = require('../models/Crypto.js');
const cryptoService = require('../services/cryptoServices.js');
const cryptoUtils = require('../utils/cryptoUtils.js');
const { getErrorMessage } = require('../utils/errorUtils.js')
const { isAuth, authentication } = require('../middlewares/authMddleware.js');


exports.getCreateCrypto = (req, res) => {//router.get('/'create',isAuth,(req, res))=>{
    console.log(req.user);

    res.render('crypto/create');
};
exports.postCreateCrypto = async (req, res) => {
    // console.log(req.body);//Object на данните от url
    console.log(req.user);

    try {
        const { name, image, price, description, paymentMethod } = req.body;

        let crypto = new Crypto({
            name,
            image,
            price,
            description,
            paymentMethod,
            owner: req.user._id,
        });
        console.log(crypto);
        await crypto.save();//запазва в db

        //или 
        //await cryptoService.create(req.user._id, { name, image, price, description, paymentMethod })

    } catch (error) {
        console.log(error.message);
        //return res.render('auth/404');
        return res.status(400).render('crypto/create', { error: getErrorMessage(error) })
    }
    res.redirect('/catalog');
};

exports.getDetails = async (req, res) => {//router.get('/:cryptoId/details',(req,res)=>{)

    const crypto = await cryptoService.getOne(req.params.cryptoId);
    //console.log(crypto)

    const isOwner = cryptoUtils.isOwner(req.user, crypto);//const isOwner = crypto.owner==req.user._id;
    // console.log(isOwner)

    const isBuyer = crypto.buyers?.some(id => id == req.user?._id);

    //crypto.paymentMethod = paymentMethodsMap[crypto.paymentMethod]

    if (!crypto) {
        return res.render('home/404');
    }

    // console.log(req.user._id);
    // console.log(req.params);
    // console.log(req.params.cryptoId);
    // console.log(`=========================================`)
    // console.log(crypto.owner.toString())

    res.render('crypto/details', { crypto, isOwner, isBuyer });
};

exports.getEditCrypto = async (req, res) => {

    const crypto = await cryptoService.getOne(req.params.cryptoId);
    const paymentMethods = cryptoUtils.generatePaymentMethod(crypto.paymentMethod);

    if (!cryptoUtils.isOwner(req.user, crypto)) {
        return res.render('home/404')// throw new Error('You are not an owner!');
    }

    res.render('crypto/edit', { crypto, paymentMethods });
};

exports.postEditCrypto = async (req, res) => {

    const { name, image, price, description, paymentMethod } = req.body

    try {
        await cryptoService.update(req.params.cryptoId, {
            name,
            image,
            price,
            description,
            paymentMethod
        })
    } catch (err) {
        console.log(err.message);
    }
    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
};

exports.getDeleteCrypto = async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId);

    const isOwner = cryptoUtils.isOwner(req.user, crypto);
    console.log(isOwner)

    if (!isOwner) {
        return res.render('home/404');
    }

    await cryptoService.delete(req.params.cryptoId);//await cryptoService.delete(crypto);
    res.redirect('/catalog');
};

exports.getBuy = async (req, res) => {//router.get('/:cryptoId/buy',isAuth)
    // const crypto = await cryptoService.getOne(req.params.cryptoId);
    // const isOwner = cryptoUtils.isOwner(req.user, crypto);
    try {
        await cryptoService.buy(req.user._id, req.params.cryptoId, req, res);
    } catch (error) {
        return res.status(400).render('home/404', { error: getErrorMessage(error) })
    }
    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
}

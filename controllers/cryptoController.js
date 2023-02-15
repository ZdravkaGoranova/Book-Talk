
const router = require('express').Router();

const Book = require('../models/Book.js');
const bookServices = require('../services/bookServices.js');
const bookUtils = require('../utils/bookUtils.js');
const { getErrorMessage } = require('../utils/errorUtils.js')
const { isAuth, authentication } = require('../middlewares/authMddleware.js');


exports.getCreateCrypto = (req, res) => {//router.get('/'create',isAuth,(req, res))=>{
    console.log(req.user);

    res.render('book/create');
};
exports.postCreateCrypto = async (req, res) => {
    // console.log(req.body);//Object на данните от url
    console.log(req.user);

    try {
        const { title, author, image, bookReview, genre, stars, wishingList } = req.body;

        let book = new Book({
            title,
            author,
            image,
            bookReview,
            genre,
            stars,
            wishingList,
            owner: req.user._id,
        });
        console.log(book);
        await book.save();//запазва в db

        //или 
        //await cryptoService.create(req.user._id, { name, image, price, description, paymentMethod })

    } catch (error) {
        console.log(error.message);
        //return res.render('auth/404');
        return res.status(400).render('book/create', { error: getErrorMessage(error) })
    }
    res.redirect('/catalog');
};

exports.getDetails = async (req, res) => {//router.get('/:cryptoId/details',(req,res)=>{)

    const book = await bookServices.getOne(req.params.bookId);
    //console.log(crypto)

    const isOwner = bookUtils.isOwner(req.user, book);//const isOwner = crypto.owner==req.user._id;
    // console.log(isOwner)

    const isWished = book.wishingList?.some(id => id == req.user?._id);

    //crypto.paymentMethod = paymentMethodsMap[crypto.paymentMethod]

    if (!book) {
        return res.render('home/404');
    }

    // console.log(req.user._id);
    // console.log(req.params);
    // console.log(req.params.cryptoId);
    // console.log(`=========================================`)
    // console.log(crypto.owner.toString())

    res.render('book/details', { book, isOwner, isWished });
};

exports.getEditCrypto = async (req, res) => {

    const book = await bookServices.getOne(req.params.bookId);
    const paymentMethods = bookUtils.generatePaymentMethod(book.paymentMethod);

    if (!bookUtils.isOwner(req.user, book)) {
        return res.render('home/404')// throw new Error('You are not an owner!');
    }

    res.render('book/edit', { book, paymentMethods });
};

exports.postEditCrypto = async (req, res) => {

    const { title, author, image, bookReview, genre, stars, wishingList } = req.body

    try {
        await bookServices.update(req.params.bookId, {
            title,
            author,
            image,
            bookReview,
            genre,
            stars,
            wishingList
        })
    } catch (err) {
        console.log(err.message);
    }
    res.redirect(`/books/${req.params.bookId}/details`);
};

exports.getDeleteCrypto = async (req, res) => {
    const book = await bookServices.getOne(req.params.bookId);

    const isOwner = bookUtils.isOwner(req.user, book);
    console.log(isOwner)

    if (!isOwner) {
        return res.render('home/404');
    }

    await bookServices.delete(req.params.bookId);//await cryptoService.delete(crypto);
    res.redirect('/catalog');
};

exports.getWish  = async (req, res) => {//router.get('/:cryptoId/buy',isAuth)
    // const crypto = await cryptoService.getOne(req.params.cryptoId);
    // const isOwner = cryptoUtils.isOwner(req.user, crypto);
    try {
        await bookServices.buy(req.user._id, req.params.bookId, req, res);
    } catch (error) {
        return res.status(400).render('home/404', { error: getErrorMessage(error) })
    }
    res.redirect(`/books/${req.params.bookId}/details`);
}

const Book = require('../models/Book.js');

const bookUtils = require('../utils/bookUtils.js');

exports.search = async (name, paymentMethod) => {

    let cprypto = await this.getAll();

    if (name) {
        cprypto = cprypto.filter(x => x.name.toLowerCase() == name.toLowerCase())
    }

    if (paymentMethod) {
        cprypto = cprypto.filter(x => x.paymentMethod == paymentMethod)
    }
    return cprypto;
};

exports.getAll = () => Book.find({}).lean();

exports.create = (ownerId, cryptoData) => Book.create({ ...cryptoData, owner: ownerId });

exports.getOne = (bookId) => Book.findById(bookId).lean();

exports.update = (bookId, data) => Book.findByIdAndUpdate(bookId, data, { runValidators: true });

exports.delete = (bookId) => Book.findByIdAndDelete(bookId);


exports.getMyWishBook = (userId) => Book.find({ wishingList: userId}).lean();



exports.wish = async (userId, bookId, req, res) => {
    const book = await Book.findById(bookId);
    const isOwner = book.owner == req.user._id;
    const isWish  = book.wishingList?.some(id => id == req.user?._id);

    if (isOwner) {
        return res.render('home/404');
        //throw new Error ('You is Owner')
    }
    if (isWish) {
        return res.render('home/404');
        // throw new Error ('You already bought these crypto coins.')
    }

    book.wishingList.push(userId);
    return await book.save();
    //console.log(crypto.buyers)
    //или Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId } })
};

   

//     const isWish  = book.wishingList?.filter(id => id == req.user?._id);
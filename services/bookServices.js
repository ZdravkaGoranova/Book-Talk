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

exports.getOne = (cryptoId) => Book.findById(cryptoId).lean();

exports.update = (cryptoId, data) => Book.findByIdAndUpdate(cryptoId, data, { runValidators: true });

exports.buy = async (userId, bookId, req, res) => {
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

exports.delete = (cryptoId) => Book.findByIdAndDelete(cryptoId);

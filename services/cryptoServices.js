const Crypto = require('../models/Crypto.js');

const cryptoUtils = require('../utils/cryptoUtils.js');

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

exports.getAll = () => Crypto.find({}).lean();

exports.create = (ownerId, cryptoData) => Crypto.create({ ...cryptoData, owner: ownerId });

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();

exports.update = (cryptoId, data) => Crypto.findByIdAndUpdate(cryptoId, data, { runValidators: true });

exports.buy = async (userId, cryptoId, req, res) => {
    const crypto = await Crypto.findById(cryptoId);
    const isOwner = crypto.owner == req.user._id;
    const isBought = crypto.buyers?.some(id => id == req.user?._id);

    if (isOwner) {
        return res.render('home/404');
        //throw new Error ('You is Owner')
    }
    if (isBought) {
        return res.render('home/404');
        // throw new Error ('You already bought these crypto coins.')
    }

    crypto.buyers.push(userId);
    return await crypto.save();
    //console.log(crypto.buyers)
    //или Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId } })
};

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);


//????
// exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId, (error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('-------');
//         console.log('User has been deleted.');
//     }
// });
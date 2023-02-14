const mongoose = require('mongoose');

const cryptoShema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [2, 'Name should be at least two characters!'],
        required: true,

    },
    image:
    {
        type: String,
        required: true,
        match: [/^http[s]?:\/\//, 'Invalid URL'],
        // http / httpsvalidation 
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description should be a minimum of 10 characters long!'],
    },
    paymentMethod: {
        type: String,
        //enum:{values:['crypto-wallet','credit-card','debit-card','paypal'],
        //message:'Invalid paymentmethod',
        //}
        required: true,
    },

    // owner - object Id(a reference to the User model)
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    buyers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],

    //или
    // buyers: {
    //     type: [mongoose.Types.ObjectId],
    //     default: [],
    //     ref: 'User'
    // },

});


const Crypto = mongoose.model('Crypto', cryptoShema);

module.exports = Crypto;
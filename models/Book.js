const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [2, 'Title should be at least two characters!'],
        required: true,

    },
    author: {
        type: String,
        required: true,
        minLength: [5, 'Title should be at least two characters!'],

    },
    image: {
        type: String,
        match: [/^http[s]?:\/\//, 'Invalid URL'],
        required: true,

    },
    bookReview: {
        type: String,
        minLength: [10, 'Title should be at least two characters!'],
        required: true,

    },
    genre: {
        type: String,
        required: true,
        minLength: [3, 'Title should be at least two characters!'],

    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },


    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    wishingList: [{
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


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
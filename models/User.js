const mongoose = require('mongoose');


const userShema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Username is required!'],

        minLength: [5, 'Username is too short!Username should be at least five characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: [10, 'Email is too short!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        //minLength: 4,
    },
    // }, {
    //     virtuals: {
    //         confirmPassword: {
    //             set(value) {
    //                 if (this.password !== value) {
    //                     throw new mongoose.Error('Password missmatch!');
    //                 }
    //             }
    //         }
    //     }

});

//userShema.virtual('confirmPassword').set;

const User = mongoose.model('User', userShema);

module.exports = User;
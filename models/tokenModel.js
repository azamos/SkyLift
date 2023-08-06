const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = new Schema({
    _id:{
        type: String,
        required: true
    },
    authorization:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    user:{
        type:String,
        required: true
    }
});



module.exports = mongoose.model('Token',Token);
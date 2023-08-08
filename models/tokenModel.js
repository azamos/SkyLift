const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = new Schema({
    _id:{
        type: String,
        required: true
    },
    user:{
        type:String,
        required: true
    },
    authorization:{
        type: String,
        default: 'user'
    }
});



module.exports = mongoose.model('Token',Token);
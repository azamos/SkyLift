const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
    email: {
        type: String,
        required:true
    },

    password: {
        type: String,
        required: true
    },

    canAddflight :{
        type : Boolean,
        required: true

    }

})
module.exports = mongoose.model('Admin',Admin);
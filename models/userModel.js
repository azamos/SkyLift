const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    full_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required:true
    },
    phone_number:{
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        default: function(){
            return this.email
        }
    },
    cart: {//Flights currently in cart. For example: if traveling to thailand via russia:
        // 1.flight from TLV to THAILAND
        //  1.1 Connection: flight from TLV to MSCW: price:500usd
        //  1.2 Connection: flight from MSCW to Thailand: price 500usd
        //2.return flight from THAILAND to TLV
        // 2.1 Connection 
        // 2.2 Connection
        //Total: 4 flights
        type: Array,
        default: []
    },
    past_flights: {
        type: Array,
        default: []
    },
    future_flights:{
        type: Array,
        default: []
    },
    total_miles:{
        type: Number,
        default:0
    },
    wishlist:{
        type: Array,
        default:[]
    },
    last_login:{
        type: Date,
        default: Date.now()
    },
    logins: {
        type: Array,
        default: function(){return [this.last_login]}
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User',User);
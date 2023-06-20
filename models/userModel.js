const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id:{
        type:String,
        required: true
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
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
    }
});

module.exports = mongoose.model('User',User);
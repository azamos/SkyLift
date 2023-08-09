
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Flight = new Schema({
    title: {
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    company:{
        type: String,
        required: true
    },
    origin:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    departTime:{
        type:Date,
        required: true
    },
    estimatedTimeOfArrival: {
        type: Date,
        required: true
    },
    economyCapacity: {
        type: Number,
        default: 199
    },
    bussinessCapacity: {
        type: Number,
        default:49
    },
    availableEcoSeats: {
        type: Number,
        default: function(){return this.economyCapacity;}
    },
    availableBusnSeats: {
        type: Number,
        default: function(){return this.bussinessCapacity;}
    },
    international: {
        type: Boolean,
        default: function(){return this.origin == this.destination;}
    }
});



module.exports = mongoose.model('Flight',Flight);
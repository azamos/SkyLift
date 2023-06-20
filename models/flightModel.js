
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
    // availableSeats: {
    //     type: Array,
    //     required: True
    // },
    // status:{
    //     type:String,
    //     default: "FUTURE"//FUTURE,PAST,BOARDING,MID-FLIGHT,LANDING,LATE,ARRIVING,BAGGAGE-CHECKOUT
    // }
});



module.exports = mongoose.model('Flight',Flight);
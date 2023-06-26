const mongoose = require('mongoose');
const { schema } = require('./flightModel');
const Schema = mongoose.Schema;


/**
 * Eample: const newLocation = new Location(_id="Ben_Gurion_Airport",
 * cityName = "Tel Aviv",country = "Israel",international=true)
 */
const Location = new Schema({
    cityName:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    international: {
        type: Boolean,
        default:true
    }
});
schema.index({cityName:1})
Location.index({cityName:'text'});



module.exports = mongoose.model('Location',Location);
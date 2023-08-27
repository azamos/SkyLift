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
    airport:{
        type:String,
        required: true
    },
    latitude_deg:{
        type:String,
        default: "34.77101"
    },
    longitude_deg:{
        type: String,
        default: "31.96978"
    },
    international: {
        type: Boolean,
        default:true
    }
});
schema.index({cityName:1})
Location.index({cityName:'text'});



module.exports = mongoose.model('Location',Location);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * Eample: const newLocation = new Location(_id="Ben_Gurion_Airport",
 * cityName = "Tel Aviv",country = "Israel",international=true)
 */
const Location = new Schema({
    _id: {
        type:String,
        require:true
    },
    cityName:{
        type:String,
        require: true
    },
    country:{
        type:String,
        require: true
    },
    international: {
        type: Boolean,
        default:true
    }
});



module.exports = mongoose.model('Location',Location);
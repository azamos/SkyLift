const Location = require('../models/locationModel');

/* CREATE */
const createLocation = async (cityName, country, airport) => {
    const new_location = new Location({ cityName, country, airport });
    return await new_location.save();
}

/* READ - specific field search */
const returnPartialMatch = async partial_city_name =>
    await Location.find({ $text: { $search: partial_city_name } }).limit(10);

/* READ - List */
const locationList = async () => await Location.find({});

/* UPDATE */
const updateLocation = async (airport,cityName,country, data) => {
    try{
        //We decided that airport + cityName + country is a good enough primary key for a location
        const location = await Location.findOne({ airport,cityName,country });
        /*Note: the db function should expect the data to be correct and without faults.
        It is the role of the controller to make sure of that. */
        Object.keys(data).forEach(field=>location[field]=data[field]);
        await location.save();
        return true;
    }
    catch(e){
        console.log('issue in locationDbService.updateLocation...');
        console.error(e);
        return false;
    }
}

/* DELETE */
const deleteLocation = async (cityName) => await Location.findOne({ cityName })
    .deleteOne({})
    .catch(err => res.send({ error: err }));

module.exports = { createLocation, returnPartialMatch, locationList, updateLocation, deleteLocation };
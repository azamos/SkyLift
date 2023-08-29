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
const updateLocation = async (airport, cityName, country, data) => {
    try {
        //We decided that airport + cityName + country is a good enough primary key for a location
        const location = await Location.findOne({ airport, cityName, country });
        /*Note: the db function should expect the data to be correct and without faults.
        It is the role of the controller to make sure of that. */
        Object.keys(data).forEach(field => location[field] = data[field]);
        await location.save();
        return true;
    }
    catch (e) {
        console.log('issue in locationDbService.updateLocation...');
        console.error(e);
        return false;
    }
}

/* DELETE */
const deleteLocation = async (airport, cityName, country) => {
    try{
        const loccation_to_be_deleted = await Location.findOne({ airport, cityName, country });
        if(!loccation_to_be_deleted){
            throw new Error(`Haven't found location with airport = ${airport},
            cityName = ${cityName}, and country = ${country}. If you expected to find it, most likely it means
            that somebody else(perhaps yourslef) deleted it already`);
        }
        const delete_res = await loccation_to_be_deleted.deleteOne({});
        console.log(delete_res);
        return true;
    }
    catch(err){
        console.error(err);
        return false;
    }
}

module.exports = { createLocation, returnPartialMatch, locationList, updateLocation, deleteLocation };
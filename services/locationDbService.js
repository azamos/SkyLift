const Location = require('../models/locationModel');

const createLocation = async (cityName, country) => {
    const new_location = new Location({ cityName, country });
    return await new_location.save();
}

const returnPartialMatch = async partial_city_name =>
    await Location.find({ $text: { $search: partial_city_name } }).limit(10);

module.exports = { createLocation, returnPartialMatch };
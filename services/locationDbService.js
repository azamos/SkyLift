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
const updateLocation = async (cityName, data) => await Location.findOne({ cityName })
    .then(res => res.updateOne({ ...data }))
    .catch(err => res.send({ error: err }));

/* DELETE */
const deleteLocation = async (cityName) => await Location.findOne({ cityName })
    .deleteOne({})
    .catch(err => res.send({ error: err }));

module.exports = { createLocation, returnPartialMatch, locationList, updateLocation, deleteLocation };
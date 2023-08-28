const Flight = require("../models/flightModel");

/* CREATE */
const createFlight = async data => {
    const { special_id, title, price, company, origin, destination, departTime, estimatedTimeOfArrival, imageUrl } = data;
    const newFlight = new Flight({ special_id, title, price, company, origin, destination, departTime, estimatedTimeOfArrival, imageUrl });
    return await newFlight.save();
};

/* READ - List */
const getFlights = async () => await Flight.find({});//TODO: in future, add a limiter for pagination purposes.the name of the paramater: numOfFlights

/* READ - popular Deals */
const getPopularFlights = async () => await Flight.find({ isPopular: true })

/**READ- 1 entry
 * 
 * @param {*} dbId 
 * @returns db.collection==Flight 's entry with id==dbId.
 * To be used mainly by updateFlightData
 */
const getFlightById = async dbId => await Flight.findById(dbId);

/*TODO: TEST THIS FUNCTION! */
const getFlightsByIdArr = async arr => arr.length ? await Flight.find({ _id: { $in: arr } }) : [];

/**
 * 
 * @param {*} filterOBj 
 * @returns array of Flights with matching key-val pairs from filterOBj.
 * filter obj need to have key-val pairs as specified in ../models/flightModel.js, otherwise will not work.
 */

/*assumes filter has at the very least fields origin and destination */
const getFlightsByFilter = async (filterOBj = {}) => {
    const { origin, destination, depart, arrival } = filterOBj;
    const d1 = new Date(depart);
    const d2 = new Date(arrival);
    try {
        const filteredFlights = await Flight.find({
            origin,
            destination
        });
        return filteredFlights;
    }
    catch (e) {
        console.error(e);
        return [];
    }
}

/**UPDATE
 * 
 * @param {*} dbIdentifier 
 * @param {*} newData 
 * @returns the updated entry with id ==  dbIdentifier in the flights collection, after the newData has been written into it
 */
const updateFlightData = async (dbIdentifier, newData) => {
    const flightToBeUpdated = await getFlightById(dbIdentifier);
    if (!flightToBeUpdated) {
        return null;//Maybe throwing an error is better?
    }
    Object.keys(newData).forEach(propertyName => flightToBeUpdated[propertyName] = newData[propertyName]);
    await flightToBeUpdated.save();
    return flightToBeUpdated;
};


/* DELETE */
const deleteFlight = async flightToDeleted => {
    await flightToDeleted.deleteOne();
    return flightToDeleted;
};

/*GROUP-BY Query*/
const totalFlightsPerCompany = async () => {
    const result = await Flight.aggregate([{
        $group: {
            _id: '$company',
            totalFlights: { $sum: 1 }
        }
    }]);
    return result;
}

module.exports = {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getPopularFlights,//READ
    getFlightsByFilter,//Read
    updateFlightData,//Update
    deleteFlight,//Delete
    getFlightsByIdArr,//READ
    totalFlightsPerCompany//GroupBy
};
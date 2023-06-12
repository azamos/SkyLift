const Flight = require("../models/flightModel");

const createFlight = async data => {//TODO: make sure only a privileged user is able to create a flight.
    console.log("inside createFlight in flightDbService");
    const {title,price,company,origin,destination,departTime,estimatedTimeOfArrival} = data;
    const newFlight = new Flight({title,price,company,origin,destination,departTime,estimatedTimeOfArrival});
    return await newFlight.save();
};

const getFlights = async () => await Flight.find({});//TODO: in future, add a limiter for pagination purposes.the name of the paramater: numOfFlights


/**
 * 
 * @param {*} dbId 
 * @returns db.collection==Flight 's entry with id==dbId.
 * To be used mainly by updateFlightData
 */
const getFlightById = async dbId => await Flight.findById(dbId);

/**
 * 
 * @param {*} filterOBj 
 * @returns array of Flights with matching key-val pairs from filterOBj.
 * filter obj need to have key-val pairs as specified in ../models/flightModel.js, otherwise will not work.
 */
const getFlightsByFilter = async (filterOBj={}) => await Flight.find({...filterOBj});



/**
 * 
 * @param {*} dbIdentifier 
 * @param {*} newData 
 * @returns the updated entry with id ==  dbIdentifier in the flights collection, after the newData has been written into it
 */
const updateFlightData = async (dbIdentifier, newData) => {
    const flightToBeUpdated = await getFlightById(dbIdentifier);
    if(!flightToBeUpdated){
        return null;//Maybe throwing an error is better?
    }
    Object.keys(newData).forEach(propertyName=>flightToBeUpdated[propertyName]=newData[propertyName]);
    await flightToBeUpdated.save();
    return flightToBeUpdated;
};

const deleteFlight = async flightId => {
    const flightToDeleted = await Flight.findById(flightId);
    if(!flightId){
        return null;//Maybe throwing an error is better?
    }
    await flightToDeleted.deleteOne();
    return flightToDeleted;
};

module.exports = {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByFilter,//Read
    updateFlightData,//Update
    deleteFlight//Delete
};
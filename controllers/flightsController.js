const flightDbService = require('../services/flightDbService');


const createFlight = async (req,res) => {
    const newFlight = await flightDbService.createFlight(req.body);
    res.json(newFlight);
};

const getFlights = async (req,res) => {
    const flightsArr = await flightDbService.getFlights();
    res.json(flightsArr);
};

const getFlightsByParamaters = async (req,res) => {
    const {filterOBj} = req.params;
    const filteredFlights = await flightDbService.getFlightsByFilter(filterOBj);
    if(!filteredFlights || filteredFlights == {}){
        res.send("No flights matching the search paramaters.")
    }
    res.json(filteredFlights);
};

const getFlightById = async(req,res) => {
    const {id} = req.params;
    const flightIdentified = await flightDbService.getFlightById(id);
    if(!flightIdentified){
        res.send(`failed to find flight with id = ${id} to be retrieved from the database.`);
    }
    res.send(flightIdentified);
};

const updateFlightData = async(req,res) => {//will reach here with a get request, so extract data from req.params
    const { id,newData } = req.params;
    const flightToBeUpdated = await flightDbService.updateFlightData(id,newData);
    if(!flightToBeUpdated){
        res.send(`failed to find flight with id = ${id} to be updated.`)
    }
    res.json(flightToBeUpdated);
};

const deleteFlight = async (req,res) => await flightDbService.deleteFlight(req.params.id);

module.exports = {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight//Delete
};
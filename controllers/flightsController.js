const flightDbService = require('../services/flightDbService');

const mockReq = async () => {
    const mockData = {
        title:"Flight EA-123",
        price:100,
        company:'El Al',
        origin:'Ben Gurion Airport, Tel Aviv, Israel',
        destination:'JFK Inernational Airport, New York City, New York',
        departTime:'23/06/2023,10:00',
        estimatedTimeOfArrival:'23/06/2023,15:00'
    }
    const url = "http://localhost:3000/api/flights";
    const result = await fetch(url,{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(mockData), // body data type must match "Content-Type" header
    });
    return result;
};


const createFlight = async (req,res) => {
    const newFlight = await flightDbService.createFlight(req.body.data);
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
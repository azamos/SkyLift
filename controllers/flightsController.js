const flightDbService = require('../services/flightDbService');

/* Authorozation checks belong in the controller. */

/* only admins should be able to create new flights */
const createFlight = async (req,res) => {
    if(req.headers.authorization && req.headers.authorization == 'Admin'){
        const newFlight = await flightDbService.createFlight(req.body);
        res.json(newFlight);
        return;
    }
    res.send("error:unauthorized user");
};

/* everyone should get access to view any flight they wish, though only users should be able to place an order,
but this is beyond the scope of responsibility of this function, instead will be handled
by a placeOrder function or some such. */
const getFlights = async (req,res) => {
    const flightsArr = await flightDbService.getFlights();
    res.json(flightsArr);
};
/* again, no need for special authorization to get search results */
const getFlightsByParamaters = async (req,res) => {
    const {destination,origin,depart,arrive} = req.params;
    const filteredFlights = await flightDbService.getFlightsByFilter(filterOBj);
    if(!filteredFlights || filteredFlights == {}){
        res.send("No flights matching the search paramaters.")
    }
    res.json(filteredFlights);
};

/* consider removing. At the moment, do not see a use for such a function. */
const getFlightById = async(req,res) => {
    const {id} = req.params;
    const flightIdentified = await flightDbService.getFlightById(id);
    if(!flightIdentified){
        res.send(`failed to find flight with id = ${id} to be retrieved from the database.`);
    }
    res.send(flightIdentified);
};

/* TODO: consider splitting into 2 functions. On first observation, should only be called by an admin.
However, if a customer makes an order, will trigger this function as well, since now there are fewer seats available.
Which reminds me, that we must add checks to make sure there are enough seats available for purchase,
including multiple seats per purchase. */
const updateFlightData = async(req,res) => {//will reach here with a get request, so extract data from req.params
    const { id,newData } = req.params;
    const flightToBeUpdated = await flightDbService.updateFlightData(id,newData);
    if(!flightToBeUpdated){
        res.send(`failed to find flight with id = ${id} to be updated.`)
    }
    res.json(flightToBeUpdated);
};

/* NO BRAINER: Admins only! */
const deleteFlight = async (req,res) => {
    if(req.headers.authorization && req.headers.authorization == 'Admin'){
        await flightDbService.deleteFlight(req.params.id);
        return;
    }
    res.send("error: unauthorized user");
}

const findFlightFrom_a_to_b = async (Location_a,Location_b,desiredDepartTime=null,desiredArriveTime = null) => {
    const departing_from_a = await flightDbService.getFlightsByFilter({origin:Location_a._id});
    const arriving_to_b = await flightDbService.getFlightsByFilter({destination:Location_a.b._id})
}


module.exports = {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight//Delete
};
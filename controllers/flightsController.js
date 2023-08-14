const tokenModel = require('../models/tokenModel');
const flightDbService = require('../services/flightDbService');
const userModel = require('../services/userDbService');
const utils = require('../services/utils');
const { is_authorized } = utils;

/* Authorozation checks belong in the controller. */

/* only admins should be able to create new flights */
const createFlight = async (req,res) => {
    if(req.headers.authorization){
        const authorizedFlag = await is_authorized(req.headers.authorization);
        if(authorizedFlag){
            const newFlight = await flightDbService.createFlight(req.body);
            res.json(newFlight);
            return;
        }
    }
    res.send({error:'unauthorized request'})
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
    if(req.headers && req.headers.authorization){
        const authorizedFlag = await is_authorized(req.headers.authorization);
        if(authorizedFlag){
            await flightDbService.deleteFlight(req.body.id);
            return;
        }
    }
    res.send("error: unauthorized user");
}

const purchaseFlightSeat = async (req,res) => {
    if((req.headers && req.headers.authorization)==false){
        res.send({error:'missing authorization'});
        return;
    }
    const token_entry = await tokenModel.find({_id:req.headers.authorization});
    let userId = token_entry.user;
    const user = await userModel.findUserByMail(userId);
    if(!user){
        res.send({error:'Error: user no longer exists'});
        return;
    }
    const { flight_id, seatType } = req.body;
    const flight = flightDbService.getFlightById(flight_id);
    let seatAmount = 1;//later, change it
    /* FIRST, CHECK IF USER NOT IN PASSENGER LIST AND IF THERE ARE ENOUGH AVAILABLE SEATS */
    if(seatType=='bussiness' && !(flight.bussinessPassengers.includes(userId) ) && flight.bussinessCapacity - (seatAmount-1) > 0){
        const {bussinessPassengers,bussinessCapacity} = flight;
        bussinessPassengers.push(user);
        bussinessCapacity-=seatAmount;
        flightDbService.updateFlightData(flight_id,{bussinessCapacity,bussinessPassengers});
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if(await userModel.updateUser(user.email,future_flights)){
            res.send({msg:'flight added succesfuly'})
            return;
        }
    }
    if(seatType=='economy' && !(flight.economyPassengers.includes(userId) ) && flight.economyCapacity - (seatAmount-1) > 0){
        const {economyPassengers,economyCapacity} = flight;
        economyPassengers.push(user);
        economyCapacity-=seatAmount;
        flightDbService.updateFlightData(flight_id,{bussinessCapacity,bussinessPassengers});
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if(await userModel.updateUser(user.email,future_flights)){
            res.send({msg:'flight added succesfuly'})
            return;
        }
    }
    res.send({error:'something went wrong, flight not purchased. Please try again'});
    return;
}

const findFlightFrom_a_to_b = async (Location_a,Location_b,desiredDepartTime=null,desiredArriveTime = null) => {
    const departing_from_a = await flightDbService.getFlightsByFilter({origin:Location_a._id});
    const arriving_to_b = await flightDbService.getFlightsByFilter({destination:Location_a.b._id})
}

const getPopularFlights = async (req,res) => {
    const flightsArr = await flightDbService.getPopularFlights();
    res.json(flightsArr);
}


module.exports = {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight,//Delete
    getPopularFlights
};
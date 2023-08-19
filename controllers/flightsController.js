const tokenDbService = require('../services/tokenDbService');
const flightDbService = require('../services/flightDbService');
const userDbService = require('../services/userDbService');
const userModel = require('../models/userModel');
const utils = require('../services/utils');
const { is_authorized, valid_field_names } = utils;

/* Authorozation checks belong in the controller. */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* only admins should be able to create new flights, no need to send email to is_authorized */
const createFlight = async (req,res) => {
    if(req.cookies.token){
        const authorizedFlag = await is_authorized(req.cookies.token);
        if(authorizedFlag){
            const newFlight = await flightDbService.createFlight(req.body);
            res.json(newFlight);
            return;
        }
    }
    res.send({error:'unauthorized request'})
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* everyone should get access to view any flight they wish, though only users should be able to place an order,
but this is beyond the scope of responsibility of this function, instead will be handled
by a placeOrder function or some such. */
const getFlights = async (req,res) => {
    const flightsArr = await flightDbService.getFlights();
    res.json(flightsArr);
};
/* again, no need for special authorization to get search results */
const searchFlight = async (req,res) => {
    const {destination,origin,depart,arrival} = req.body;
    const filteredFlights = await flightDbService.getFlightsByFilter({
        destination,
        origin,
        departTime:depart,
        estimatedTimeOfArrival:arrival
    });
    if(!filteredFlights || filteredFlights == {}){
        res.send("No flights matching the search paramaters.")
    }
    res.json(filteredFlights);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TODO: consider splitting into 2 functions. On first observation, should only be called by an admin.
However, if a customer makes an order, will trigger this function as well, since now there are fewer seats available.
Which reminds me, that we must add checks to make sure there are enough seats available for purchase,
including multiple seats per purchaser. */
const updateFlightData = async(req,res) => {//will reach here with a get request, so extract data from req.params
    const { id,newData } = req.params;
    const flightToBeUpdated = await flightDbService.updateFlightData(id,newData);
    if(!flightToBeUpdated){
        res.send(`failed to find flight with id = ${id} to be updated.`)
    }
    res.json(flightToBeUpdated);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* NO BRAINER: Admins only! No need to send email, only need token type */
const deleteFlight = async (req,res) => {
    if(req.cookies && req.cookies.token){
        const authorizedFlag = await is_authorized(req.cookies.token);
        if(authorizedFlag){
            await flightDbService.deleteFlight(req.body.id);
            return;
        }
    }
    res.send("error: unauthorized user");
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const purchaseFlightSeat = async (req,res) => {
    const { flight_id, seatType } = req.body;
    if(!(req.cookies && req.cookies.token)){
        res.send({error:'missing authorization'});
        return;
    }
    const token_entry = await tokenDbService.getToken(req.cookies.token+process.env.SECRET);
    let userId = token_entry.user;
    const user = await userDbService.findUserByMail(userId);
    if(!user){
        res.send({error:'Error: user no longer exists'});
        return;
    }
    /* THIS IS WHAT MUST BE PASSED TO THE POST REQUEST */
    const flight = await flightDbService.getFlightById(flight_id);
    console.log(flight);
    if(!flight){
        res.send({error:'flight not found'});
        return;
    }
    let seatAmount = 1;//later, change it
    /* FIRST, CHECK IF USER NOT IN PASSENGER LIST AND IF THERE ARE ENOUGH AVAILABLE SEATS */
    if(seatType=='bussiness' && !(flight.bussinessPassengers.includes(userId) ) && flight.bussinessCapacity - (seatAmount-1) > 0){
        let {bussinessPassengers,bussinessCapacity} = flight;
        bussinessPassengers.push(userId);//NOTE: bad name. userId is actualy email, and not user._id
        bussinessCapacity-=seatAmount;
        flightDbService.updateFlightData(flight_id,{bussinessCapacity,bussinessPassengers});
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if(await userDbService.updateUser(user.email,{future_flights})){
            res.send({msg:'flight added succesfuly'})
            return;
        }
    }
    if(seatType=='economy' && !(flight.economyPassengers.includes(userId) ) && flight.economyCapacity - (seatAmount-1) > 0){
        let {economyPassengers,economyCapacity} = flight;
        economyPassengers.push(userId);//NOTE: bad name. userId is actualy email, and not user._id
        //However, user's email is better for checking dups, since Mongodb default _id is object,
        //and not really working against dups
        economyCapacity-=seatAmount;
        flightDbService.updateFlightData(flight_id,{economyCapacity,economyPassengers});
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if(await userDbService.updateUser(user.email,{future_flights})){
            res.send({msg:'flight added succesfuly'})
            return;
        }
    }
    res.send({error:'something went wrong, flight not purchased. Please try again'});
    return;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getPopularFlights = async (req,res) => {
    const flightsArr = await flightDbService.getPopularFlights();
    res.json(flightsArr);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = {
    createFlight,//Create
    getFlights,//Read
    searchFlight,//Read
    updateFlightData,//Update
    deleteFlight,//Delete
    getPopularFlights,
    searchFlight,
    purchaseFlightSeat
};
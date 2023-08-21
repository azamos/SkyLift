const flightsRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const {
    createFlight,//Create
    getFlights,//Read
    deleteFlight,//Delete,
    getPopularFlights,
    searchFlight,
    purchaseFlightSeat,
    deleteFlightFromAllUsers
} = require('../controllers/flightsController');

//site visitors should be able to search a flight and to see popular deals anywhere,
//no need to call authorization middleware for now.
//EXTRA: if there is time, make it so that each visitor immediately gets a user created,
//identified by his ip, user agent, or some such.
//This would allow us to simply load the authorization middleware on the parent Router insead,
//Like so: router.use('/flights',requireAuthorization,flightsRouter);
//But: we may need to change the requireAuthorization middleware.
flightsRouter.post('/searchFlight', searchFlight);
flightsRouter.get('/popular', getPopularFlights);

flightsRouter.post('/',
    requireAuthorization,//authorization middleware - only an admin may create a new flight
    createFlight);//request handler

flightsRouter.get('/',
    requireAuthorization,//authorization middleware - only an admin get a list of ALL the flights
    getFlights);//request handler

flightsRouter.post('/deleteFromAllUsers',
    requireAuthorization,//authorization middleware - only an admin may delete flight entry from a user's array
    deleteFlightFromAllUsers);//request handler

flightsRouter.post('/delete',
    requireAuthorization,//authorization middleware - only an admin may delete a flight from the collection
    deleteFlight);//request handler

flightsRouter.post('/purchase',
    requireAuthorization,//authorization middleware - need to be a user in order to purchase a seat on a flight
    purchaseFlightSeat);

module.exports = flightsRouter;
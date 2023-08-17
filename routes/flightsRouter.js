const flightsRouter = require('express').Router();
const {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight,//Delete,
    getPopularFlights,
    searchFlight
 } = require('../controllers/flightsController');

flightsRouter.post('/',createFlight);
flightsRouter.get('/',getFlights);
flightsRouter.get('/popular',getPopularFlights);
flightsRouter.post('/delete',deleteFlight);
flightsRouter.post('/searchFlight',searchFlight);

module.exports = flightsRouter;
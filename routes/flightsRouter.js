const flightsRouter = require('express').Router();
const {
    createFlight,//Create
    getFlights,//Read
    deleteFlight,//Delete,
    getPopularFlights,
    searchFlight,
    purchaseFlightSeat
 } = require('../controllers/flightsController');

flightsRouter.post('/',createFlight);
flightsRouter.put('/',updateFlightData);
flightsRouter.get('/',getFlights);
flightsRouter.get('/popular',getPopularFlights);
flightsRouter.post('/delete',deleteFlight);
flightsRouter.post('/searchFlight',searchFlight);
flightsRouter.post('/purchase',purchaseFlightSeat);

module.exports = flightsRouter;
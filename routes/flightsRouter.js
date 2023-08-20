const flightsRouter = require('express').Router();
const {
    createFlight,//Create
    getFlights,//Read
    deleteFlight,//Delete,
    getPopularFlights,
    searchFlight,
    purchaseFlightSeat,
    deleteFlightFromAllUsers
 } = require('../controllers/flightsController');

flightsRouter.post('/',createFlight);
flightsRouter.get('/',getFlights);
flightsRouter.post('/deleteFromAllUsers',deleteFlightFromAllUsers);
flightsRouter.get('/popular',getPopularFlights);
flightsRouter.post('/delete',deleteFlight);
flightsRouter.post('/searchFlight',searchFlight);
flightsRouter.post('/purchase',purchaseFlightSeat);

module.exports = flightsRouter;
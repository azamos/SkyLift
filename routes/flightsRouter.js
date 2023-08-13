const flightsRouter = require('express').Router();
const {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight,//Delete,
    getPopularFlights
 } = require('../controllers/flightsController');

flightsRouter.post('/',createFlight);
flightsRouter.get('/',getFlights);
flightsRouter.get('/popular',getPopularFlights);
flightsRouter.route('/:id')
    .get(getFlightById)
    .put(updateFlightData)
    .delete(deleteFlight)
flightsRouter.get('/:filterOBj',getFlightsByParamaters);

module.exports = flightsRouter;
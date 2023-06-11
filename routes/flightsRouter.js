const flightsRouter = require('express').Router();
const {
    createFlight,//Create
    getFlights,//Read
    getFlightById,//Read
    getFlightsByParamaters,//Read
    updateFlightData,//Update
    deleteFlight//Delete
 } = require('../controllers/flightsController');

flightsRouter.post('/',createFlight);
flightsRouter.get('/',getFlights);
flightsRouter.route('/:id')
    .get(getFlightById)
    .put(updateFlightData)
flightsRouter.get('/:filterOBj',getFlightsByParamaters);
flightsRouter.delete('/:id',deleteFlight);

module.exports = flightsRouter;
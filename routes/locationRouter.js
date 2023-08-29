const locationRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const{
    getLocationsList,
    createLocation,
    getPartialMatch,
    updateLocationData
} = require('../controllers/locationController');


locationRouter.get('/:partial_string',getPartialMatch);
locationRouter.get('/',requireAuthorization,getLocationsList);
locationRouter.post('/update',requireAuthorization,updateLocationData);
locationRouter.post('/',requireAuthorization,createLocation);

module.exports = locationRouter;
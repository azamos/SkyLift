const locationRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const{
    getLocationsList,
    createLocation,
    getPartialMatch
} = require('../controllers/locationController');


locationRouter.get('/:partial_string',requireAuthorization,getPartialMatch);
locationRouter.get('/',requireAuthorization,getLocationsList);
locationRouter.post('/',requireAuthorization,createLocation);

module.exports = locationRouter;
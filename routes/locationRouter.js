const locationRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const{
    getLocationsList,
    createLocation,
    getPartialMatch,
    updateLocationData,
    deleteLocation
} = require('../controllers/locationController');


locationRouter.get('/:partial_string',getPartialMatch);//can be used by users not even logged in
locationRouter.get('/',requireAuthorization,getLocationsList);
locationRouter.post('/update',requireAuthorization,updateLocationData);
locationRouter.post('/',requireAuthorization,createLocation);
locationRouter.post('/deleteLocation',requireAuthorization,deleteLocation);

module.exports = locationRouter;